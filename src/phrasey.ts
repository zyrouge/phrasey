import p from "path";
import FastGlob from "fast-glob";
import { ensureFile, writeFile } from "fs-extra";
import { PhraseyTranslation } from "./translation";
import { PhraseyResult, PhraseySafeRun } from "./result";
import {
    PhraseyContentFormatter,
    PhraseyContentFormats,
} from "./contentFormats";
import { PhraseyError, PhraseyWrappedError } from "./error";
import { PhraseySummary } from "./summary";
import { PhraseyHooks } from "./hooks";
import {
    PhraseyTranslationStringFormats,
    PhraseyTranslationStringFormatter,
} from "./translationStringFormat";
import { PhraseyConfig } from "./config";
import { PhraseySchema } from "./schema";
import { PhraseyTranslations } from "./translations";
import { PhraseyUtils } from "./utils";
import { PhraseyLogger } from "./logger";

export interface PhraseyCreateOptions {
    config: {
        file: string;
        format: string;
    };
    log: PhraseyLogger;
    source?: string;
}

export interface PhraseyLoadOptions {
    filter?(path: string): boolean;
}

export interface PhraseyProps {
    cwd: string;
    config: PhraseyConfig;
    schema: PhraseySchema;
    translations: PhraseyTranslations;
    hooks: PhraseyHooks;
    log: PhraseyLogger;
}

export interface PhraseyOptions extends PhraseyProps {
    source?: string;
}

export class Phrasey implements PhraseyProps {
    defaultLocale: string | null = null;
    loadErrors: Error[] = [];
    ensureErrors: Error[] = [];
    buildErrors: Error[] = [];

    cwd: string;
    config: PhraseyConfig;
    schema: PhraseySchema;
    translations: PhraseyTranslations;
    hooks: PhraseyHooks;
    log: PhraseyLogger;

    constructor(public readonly options: PhraseyOptions) {
        this.cwd = options.cwd;
        this.config = options.config;
        this.schema = options.schema;
        this.translations = options.translations;
        this.hooks = options.hooks;
        this.log = options.log;
    }

    async load(options: PhraseyLoadOptions = {}): Promise<boolean> {
        await this.hooks.dispatch("beforeLoad", {});
        const formatter = PhraseyContentFormats.resolve(
            this.config.z.input.format
        );
        const globalFallback = PhraseyUtils.parseStringArrayNullable(
            this.config.z.input.fallback
        ).map((x) => this.path(x));
        const stream = FastGlob.stream(this.config.z.input.files, {
            cwd: this.cwd,
            absolute: true,
            dot: true,
            onlyFiles: true,
        });
        for await (const x of stream) {
            const path = x.toString();
            if (options.filter && !options.filter(path)) continue;
            await this.loadTranslation(path, formatter, globalFallback);
        }
        await this.hooks.dispatch("afterLoad", {});
        return !this.hasLoadErrors();
    }

    async loadTranslation(
        path: string,
        formatter: PhraseyContentFormatter,
        globalFallback: string[]
    ): Promise<string | null> {
        await this.hooks.dispatch("beforeLoadTranslation", {});
        const result = await this.translations.load(
            path,
            formatter,
            globalFallback
        );
        if (!result.success) {
            this.loadErrors.push(result.error);
            return null;
        }
        await this.hooks.dispatch("afterLoadTranslation", {
            locale: result.data,
        });
        return result.data;
    }

    async ensure(): Promise<boolean> {
        await this.hooks.dispatch("beforeEnsure", {});
        for (const x of this.translations.values()) {
            await this.ensureTranslation(x);
        }
        await this.hooks.dispatch("afterEnsure", {});
        return !this.hasEnsureErrors();
    }

    async ensureTranslation(translation: PhraseyTranslation): Promise<boolean> {
        const localeCode = translation.locale.code;
        await this.hooks.dispatch("beforeEnsureTranslation", {
            locale: localeCode,
        });
        const result = this.translations.ensure(translation);
        if (!result.success) {
            this.ensureErrors.push(result.error);
            return false;
        }
        await this.hooks.dispatch("afterEnsureTranslation", {
            locale: localeCode,
        });
        return true;
    }

    async build(): Promise<boolean> {
        await this.hooks.dispatch("beforeBuild", {});
        if (!this.config.z.output) {
            this.loadErrors.push(
                new PhraseyError(
                    `Cannot build when "output" is not specified in configuration file`
                )
            );
            return false;
        }
        const formatter = PhraseyContentFormats.resolve(
            this.config.z.output.format
        );
        const stringFormatter = PhraseyTranslationStringFormats.resolve(
            this.config.z.output.stringFormat
        );
        for (const x of this.translations.values()) {
            const path = this.path(
                this.config.z.output.dir,
                `${x.locale.code}.${formatter.extension}`
            );
            await this.buildTranslation(path, x, formatter, stringFormatter);
        }
        await this.hooks.dispatch("afterBuild", {});
        return !this.hasBuildErrors();
    }

    async buildTranslation(
        path: string,
        translation: PhraseyTranslation,
        formatter: PhraseyContentFormatter,
        stringFormatter: PhraseyTranslationStringFormatter
    ): Promise<boolean> {
        const localeCode = translation.locale.code;
        await this.hooks.dispatch("beforeBuildTranslation", {
            locale: localeCode,
        });
        if (!translation.stats.isBuildable) {
            this.buildErrors.push(
                new PhraseyError(`Translation "${localeCode}" is not buildable`)
            );
            return false;
        }
        await ensureFile(path);
        const content = PhraseySafeRun(() =>
            formatter.serialize(translation.json(stringFormatter))
        );
        if (!content.success) {
            this.buildErrors.push(
                new PhraseyWrappedError(
                    `Serializing "${localeCode}" failed`,
                    content.error
                )
            );
            return false;
        }
        await writeFile(path, content.data);
        await this.hooks.dispatch("afterBuildTranslation", {
            locale: localeCode,
        });
        return true;
    }

    hasLoadErrors() {
        return this.loadErrors.length > 0;
    }

    hasEnsureErrors() {
        return this.ensureErrors.length > 0;
    }

    hasBuildErrors() {
        return this.buildErrors.length > 0;
    }

    prepareSummary() {
        const summary = new PhraseySummary();
        for (const x of this.translations.values()) {
            summary.add(x);
        }
        return summary;
    }

    path(...parts: string[]) {
        return p.resolve(this.cwd, ...parts);
    }

    static async create(
        options: PhraseyCreateOptions
    ): Promise<PhraseyResult<Phrasey, Error>> {
        options.config.file = p.resolve(process.cwd(), options.config.file);
        const config = await PhraseyConfig.create(
            options.config.file,
            options.config.format
        );
        if (!config.success) return config;
        const cwd = p.dirname(options.config.file);
        config.data.z.schema.file = p.resolve(cwd, config.data.z.schema.file);
        const schema = await PhraseySchema.create(
            config.data.z.schema.file,
            config.data.z.schema.format
        );
        if (!schema.success) return schema;
        const translations = new PhraseyTranslations(schema.data);
        const hooks = new PhraseyHooks();
        if (config.data.z.hooks?.files) {
            for (let i = 0; i < config.data.z.hooks.files.length; i++) {
                const hookFilePath = p.resolve(
                    cwd,
                    config.data.z.hooks.files[i]!
                );
                config.data.z.hooks.files[i] = hookFilePath;
                hooks.addHandlerFile(hookFilePath);
            }
        }
        const phrasey = new Phrasey({
            cwd,
            config: config.data,
            schema: schema.data,
            translations,
            hooks,
            log: options.log,
            source: options.source,
        });
        hooks.bind(phrasey);
        await hooks.dispatch("onCreate", {});
        return { success: true, data: phrasey };
    }
}
