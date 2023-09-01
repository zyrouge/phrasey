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
import {
    PhraseyDefaultLocales,
    PhraseyLocaleType,
    PhraseyLocales,
} from "./locales";

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
    loadErrors: Error[] = [];
    ensureErrors: Error[] = [];
    buildErrors: Error[] = [];
    locales: PhraseyLocaleType[] = [];

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
        const localesResult = await this.loadLocales();
        if (!localesResult) {
            return localesResult;
        }
        const translationsResult = await this.loadTranslations(options);
        return translationsResult;
    }

    async loadLocales(): Promise<boolean> {
        const beforeHookResult = await this.hooks.dispatch(
            "beforeLoadLocales",
            {},
        );
        if (!beforeHookResult.success) {
            this.loadErrors.push(beforeHookResult.error);
            return false;
        }
        if (this.config.z.locales) {
            const locales = await PhraseyLocales.resolve(
                this.config.z.locales.file,
                this.config.z.locales.format,
            );
            if (locales.success) {
                this.locales.push(...locales.data);
            } else {
                this.loadErrors.push(locales.error);
            }
        } else {
            this.locales.push(...PhraseyDefaultLocales);
        }
        const afterHookResult = await this.hooks.dispatch(
            "afterLoadLocales",
            {},
        );
        if (!afterHookResult.success) {
            this.loadErrors.push(afterHookResult.error);
            return false;
        }
        return !this.hasLoadErrors();
    }

    async loadTranslations(options: PhraseyLoadOptions = {}): Promise<boolean> {
        const beforeHookResult = await this.hooks.dispatch("beforeLoad", {});
        if (!beforeHookResult.success) {
            this.loadErrors.push(beforeHookResult.error);
            return false;
        }
        const formatter = PhraseyContentFormats.resolve(
            this.config.z.input.format,
        );
        const globalFallback = PhraseyUtils.parseStringArrayNullable(
            this.config.z.input.fallback,
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
        const afterHookResult = await this.hooks.dispatch("afterLoad", {});
        if (!afterHookResult.success) {
            this.loadErrors.push(afterHookResult.error);
            return false;
        }
        return !this.hasLoadErrors();
    }

    async loadTranslation(
        path: string,
        formatter: PhraseyContentFormatter,
        globalFallback: string[],
    ): Promise<string | null> {
        const beforeHookResult = await this.hooks.dispatch(
            "beforeLoadTranslation",
            {},
        );
        if (!beforeHookResult.success) {
            this.loadErrors.push(beforeHookResult.error);
            return null;
        }
        const result = await this.translations.load(
            path,
            formatter,
            this.locales,
            globalFallback,
        );
        if (!result.success) {
            this.loadErrors.push(result.error);
            return null;
        }
        const afterHookResult = await this.hooks.dispatch(
            "afterLoadTranslation",
            {
                locale: result.data,
            },
        );
        if (!afterHookResult.success) {
            this.loadErrors.push(afterHookResult.error);
            // should "null" be returned?
        }
        return result.data;
    }

    async ensure(): Promise<boolean> {
        const beforeHookResult = await this.hooks.dispatch("beforeEnsure", {});
        if (!beforeHookResult.success) {
            this.ensureErrors.push(beforeHookResult.error);
            return false;
        }
        for (const x of this.translations.values()) {
            await this.ensureTranslation(x);
        }
        const afterHookResult = await this.hooks.dispatch("afterEnsure", {});
        if (!afterHookResult.success) {
            this.ensureErrors.push(afterHookResult.error);
            return false;
        }
        return !this.hasEnsureErrors();
    }

    async ensureTranslation(translation: PhraseyTranslation): Promise<boolean> {
        const localeCode = translation.locale.code;
        const beforeHookResult = await this.hooks.dispatch(
            "beforeEnsureTranslation",
            {
                locale: localeCode,
            },
        );
        if (!beforeHookResult.success) {
            this.ensureErrors.push(beforeHookResult.error);
            return false;
        }
        const result = this.translations.ensure(translation);
        if (!result.success) {
            this.ensureErrors.push(result.error);
            return false;
        }
        const afterHookResult = await this.hooks.dispatch(
            "afterEnsureTranslation",
            {
                locale: localeCode,
            },
        );
        if (!afterHookResult.success) {
            this.ensureErrors.push(afterHookResult.error);
            return false;
        }
        return true;
    }

    async build(): Promise<boolean> {
        const beforeHookResult = await this.hooks.dispatch("beforeBuild", {});
        if (!beforeHookResult.success) {
            this.buildErrors.push(beforeHookResult.error);
            return false;
        }
        if (!this.config.z.output) {
            this.loadErrors.push(
                new PhraseyError(
                    `Cannot build when "output" is not specified in configuration file`,
                ),
            );
            return false;
        }
        const formatter = PhraseyContentFormats.resolve(
            this.config.z.output.format,
        );
        const stringFormatter = PhraseyTranslationStringFormats.resolve(
            this.config.z.output.stringFormat,
        );
        for (const x of this.translations.values()) {
            const path = this.path(
                this.config.z.output.dir,
                `${x.locale.code}.${formatter.extension}`,
            );
            await this.buildTranslation(path, x, formatter, stringFormatter);
        }
        const afterHookResult = await this.hooks.dispatch("afterBuild", {});
        if (!afterHookResult.success) {
            this.buildErrors.push(afterHookResult.error);
            return false;
        }
        return !this.hasBuildErrors();
    }

    async buildTranslation(
        path: string,
        translation: PhraseyTranslation,
        formatter: PhraseyContentFormatter,
        stringFormatter: PhraseyTranslationStringFormatter,
    ): Promise<boolean> {
        const localeCode = translation.locale.code;
        const beforeHookResult = await this.hooks.dispatch(
            "beforeBuildTranslation",
            {
                locale: localeCode,
            },
        );
        if (!beforeHookResult.success) {
            this.buildErrors.push(beforeHookResult.error);
            return false;
        }
        if (!translation.stats.isBuildable) {
            this.buildErrors.push(
                new PhraseyError(
                    `Translation "${localeCode}" is not buildable`,
                ),
            );
            return false;
        }
        await ensureFile(path);
        const content = PhraseySafeRun(() =>
            formatter.serialize(translation.json(stringFormatter)),
        );
        if (!content.success) {
            this.buildErrors.push(
                new PhraseyWrappedError(
                    `Serializing "${localeCode}" failed`,
                    content.error,
                ),
            );
            return false;
        }
        await writeFile(path, content.data);
        const afterHookResult = await this.hooks.dispatch(
            "afterBuildTranslation",
            {
                locale: localeCode,
            },
        );
        if (!afterHookResult.success) {
            this.buildErrors.push(afterHookResult.error);
            return false;
        }
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
        const summary = new PhraseySummary({
            keysCount: this.schema.keysCount(),
        });
        for (const x of this.translations.values()) {
            summary.add(x);
        }
        return summary;
    }

    resetErrors() {
        this.loadErrors = [];
        this.ensureErrors = [];
        this.buildErrors = [];
    }

    resetLocales() {
        this.locales = [];
    }

    path(...parts: string[]) {
        return p.resolve(this.cwd, ...parts);
    }

    rpath(path: string) {
        return p.relative(this.cwd, path);
    }

    static async create(
        options: PhraseyCreateOptions,
    ): Promise<PhraseyResult<Phrasey, Error>> {
        options.config.file = p.resolve(process.cwd(), options.config.file);
        const config = await PhraseyConfig.create(
            options.config.file,
            options.config.format,
        );
        if (!config.success) return config;
        const cwd = p.dirname(options.config.file);
        config.data.z.schema.file = p.resolve(cwd, config.data.z.schema.file);
        const schema = await PhraseySchema.create(
            config.data.z.schema.file,
            config.data.z.schema.format,
        );
        if (!schema.success) return schema;
        const translations = new PhraseyTranslations(schema.data);
        const hooks = new PhraseyHooks();
        if (config.data.z.hooks?.files) {
            for (let i = 0; i < config.data.z.hooks.files.length; i++) {
                const x = config.data.z.hooks.files[i]!;
                x.path = p.resolve(cwd, x.path);
                hooks.addHandlerFile(x.path, x.options ?? {});
            }
        }
        if (config.data.z.locales) {
            config.data.z.locales.file = p.resolve(
                cwd,
                config.data.z.locales.file,
            );
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
        const hookResult = await hooks.dispatch("onCreate", {});
        if (!hookResult.success) {
            return hookResult;
        }
        return { success: true, data: phrasey };
    }
}
