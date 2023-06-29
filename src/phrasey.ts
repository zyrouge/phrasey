import p from "path";
import FastGlob from "fast-glob";
import { ensureFile, writeFile } from "fs-extra";
import { PhraseyTranslation } from "./translation";
import { PhraseyResult, PhraseySafeRun } from "./result";
import {
    PhraseyContentFormatDeserializer,
    PhraseyContentFormatSerializer,
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

export interface PhraseyCreateOptions {
    config: {
        file: string;
        format: string;
    };
    source?: string;
}

export interface PhraseyLoadOptions {
    filter?(path: string): boolean;
}

export interface PhraseyAdditional {
    source?: string;
}

export class Phrasey {
    defaultLocale: string | null = null;
    translations = new Map<string, PhraseyTranslation>();
    loadErrors: Error[] = [];
    buildErrors: Error[] = [];

    constructor(
        public cwd: string,
        public config: PhraseyConfig,
        public schema: PhraseySchema,
        public hooks: PhraseyHooks,
        public additional: PhraseyAdditional
    ) {}

    async load(options: PhraseyLoadOptions = {}): Promise<boolean> {
        await this.hooks.dispatch("beforeLoad", this);
        const defaultTranslationPath = this.config.z.input.default
            ? p.resolve(this.cwd, this.config.z.input.default)
            : undefined;
        const deserializer = PhraseyContentFormats.resolveDeserializer(
            this.config.z.input.format
        );
        let defaultTranslation: PhraseyTranslation | undefined;
        if (defaultTranslationPath) {
            const locale = await this.loadTranslation(
                defaultTranslationPath,
                deserializer
            );
            if (locale) {
                this.defaultLocale = locale;
                defaultTranslation = this.translations.get(locale);
            }
        }
        const stream = FastGlob.stream(this.config.z.input.files, {
            cwd: this.cwd,
            absolute: true,
            dot: true,
            onlyFiles: true,
        });
        for await (const x of stream) {
            const path = x.toString();
            if (options.filter && !options.filter(path)) continue;
            await this.loadTranslation(path, deserializer, defaultTranslation);
        }
        await this.hooks.dispatch("afterLoad", this);
        return !this.hasLoadErrors();
    }

    async loadTranslation(
        path: string,
        deserializer: PhraseyContentFormatDeserializer,
        defaultTranslation?: PhraseyTranslation
    ): Promise<string | null> {
        await this.hooks.dispatch("beforeLoadTranslation", this);
        const translation = await PhraseyTranslation.create(
            path,
            this.schema,
            deserializer,
            defaultTranslation
        );
        if (!translation.success) {
            this.loadErrors.push(translation.error);
            return null;
        }
        this.translations.set(translation.data.locale.code, translation.data);
        await this.hooks.dispatch(
            "afterLoadTranslation",
            this,
            translation.data.locale.code
        );
        return translation.data.locale.code;
    }

    async build(): Promise<boolean> {
        await this.hooks.dispatch("beforeBuild", this);
        if (!this.config.z.output) {
            this.loadErrors.push(
                new PhraseyError(
                    `Cannot build when "output" is not specified in configuration file`
                )
            );
            return false;
        }
        const serializer = PhraseyContentFormats.resolveSerializer(
            this.config.z.output.format
        );
        const stringFormatter = PhraseyTranslationStringFormats.resolve(
            this.config.z.output.stringFormat
        );
        for (const x of this.translations.values()) {
            const path = p.resolve(
                this.cwd,
                this.config.z.output.dir,
                `${x.locale.code}.${serializer.extension}`
            );
            await this.buildTranslation(path, x, serializer, stringFormatter);
        }
        await this.hooks.dispatch("afterBuild", this);
        return !this.hasBuildErrors();
    }

    async buildTranslation(
        path: string,
        translation: PhraseyTranslation,
        serializer: PhraseyContentFormatSerializer,
        stringFormatter: PhraseyTranslationStringFormatter
    ): Promise<boolean> {
        await this.hooks.dispatch("beforeBuildTranslation", this);
        if (!translation.stats.isBuildable) {
            this.buildErrors.push(
                new PhraseyError(
                    `Translation "${translation.locale.code}" is not buildable`
                )
            );
            return false;
        }
        await ensureFile(path);
        const content = PhraseySafeRun(() =>
            serializer.serialize(translation.json(stringFormatter))
        );
        if (!content.success) {
            this.buildErrors.push(
                new PhraseyWrappedError(
                    `Serializing "${translation.locale.code}" failed`,
                    content.error
                )
            );
            return false;
        }
        await writeFile(path, content.data);
        await this.hooks.dispatch(
            "afterBuildTranslation",
            this,
            translation.locale.code
        );
        return true;
    }

    hasLoadErrors() {
        return this.loadErrors.length > 0;
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
        const additional: PhraseyAdditional = {
            source: options.source,
        };
        const phrasey = new Phrasey(
            cwd,
            config.data,
            schema.data,
            hooks,
            additional
        );
        await hooks.dispatch("onCreate", phrasey);
        return { success: true, data: phrasey };
    }
}
