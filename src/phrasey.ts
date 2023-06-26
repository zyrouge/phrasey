import p from "path";
import FastGlob from "fast-glob";
import { ensureFile, writeFile } from "fs-extra";
import { PhraseyConfig, PhraseyConfigType } from "./config";
import { PhraseyTranslation } from "./translation";
import { PhraseyResult, safeRun } from "./result";
import { PhraseyTransformer } from "./transformer";
import { PhraseySchema, PhraseySchemaType } from "./schema";
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

export interface PhraseyCreateOptions {
    config: {
        path: string;
        format: string;
    };
}

export class Phrasey {
    defaultLocale: string | null = null;
    translations = new Map<string, PhraseyTranslation>();
    loadErrors: Error[] = [];
    buildErrors: Error[] = [];
    hooks = new PhraseyHooks();

    constructor(
        public cwd: string,
        public config: PhraseyConfigType,
        public schema: PhraseySchemaType
    ) {}

    async init() {
        if (this.config.hooks?.file) {
            this.config.hooks.file = p.resolve(
                this.cwd,
                this.config.hooks.file
            );
            await this.hooks.addHandlerFile(this.config.hooks.file);
        }
        await this.hooks.dispatch("afterInit", this);
    }

    async load(): Promise<boolean> {
        await this.hooks.dispatch("beforeLoad", this);
        const defaultTranslationPath = this.config.input.default
            ? p.resolve(this.cwd, this.config.input.default)
            : undefined;
        const deserializer = PhraseyContentFormats.resolveDeserializer(
            this.config.input.format
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
        const stream = FastGlob.stream(this.config.input.files, {
            cwd: this.cwd,
            absolute: true,
            dot: true,
            onlyFiles: true,
        });
        for await (const x of stream) {
            const path = x.toString();
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
        if (!this.config.output) {
            this.loadErrors.push(
                new PhraseyError(
                    `Cannot build when "output" is not specified in configuration file`
                )
            );
            return false;
        }
        const serializer = PhraseyContentFormats.resolveSerializer(
            this.config.output.format
        );
        const stringFormatter = PhraseyTranslationStringFormats.resolve(
            this.config.output.stringFormat
        );
        for (const x of this.translations.values()) {
            const path = p.resolve(
                this.cwd,
                this.config.output.dir,
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
        const content = safeRun(() =>
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
        options.config.path = p.resolve(process.cwd(), options.config.path);
        const config = await PhraseyTransformer.transform(
            options.config.path,
            PhraseyContentFormats.resolveDeserializer(options.config.format),
            PhraseyConfig
        );
        if (!config.success) return config;
        const cwd = p.dirname(options.config.path);
        config.data.schema.path = p.resolve(cwd, config.data.schema.path);
        const schema = await PhraseyTransformer.transform(
            config.data.schema.path,
            PhraseyContentFormats.resolveDeserializer(
                config.data.schema.format
            ),
            PhraseySchema
        );
        if (!schema.success) return schema;
        const phrasey = new Phrasey(cwd, config.data, schema.data);
        await phrasey.init();
        return {
            success: true,
            data: phrasey,
        };
    }
}
