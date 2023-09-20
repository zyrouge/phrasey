import FastGlob from "fast-glob";
import { ensureFile, writeFile } from "fs-extra";
import { PhraseyTranslation } from "./translation";
import { PhraseyResult, PhraseySafeRun } from "./result";
import {
    PhraseyContentFormatter,
    PhraseyContentFormats,
} from "./contentFormats";
import { PhraseyError, PhraseyWrappedError } from "./errors";
import { PhraseyHooks } from "./hooks";
import {
    PhraseyTranslationStringFormats,
    PhraseyTranslationStringFormatter,
} from "./translationStringFormat";
import { PhraseyConfig } from "./config";
import { PhraseyBuildablePipeline, PhraseyUtils } from "./utils";
import { PhraseyLocales } from "./locales";
import { Phrasey, PhraseyOptions } from "./phrasey";
import { PhraseyState } from "./state";
import { PhraseySummary } from "./summary";

export interface PhraseyBuilderOptions extends PhraseyOptions {
    config: {
        file: string;
        format: string;
    };
}

export interface PhraseyBuilderConstructPipelineOptions {
    loadConfig: boolean;
    loadHooks: boolean;
    loadLocales: boolean;
    loadTranslations: boolean;
    ensureTranslations: boolean;
    buildTranslations: boolean;
}

export class PhraseyBuilder {
    state: PhraseyState;

    constructor(
        public phrasey: Phrasey,
        public options: PhraseyBuilderOptions,
    ) {
        this.state = new PhraseyState(phrasey, {});
    }

    async loadConfig(): Promise<PhraseyResult<true, Error>> {
        const configPath = this.phrasey.path(this.options.config.file);
        const configResult = await PhraseyConfig.create(
            configPath,
            this.options.config.format,
        );
        if (!configResult.success) {
            return configResult;
        }
        this.state.setConfig(configResult.data);
        return { success: true, data: true };
    }

    async loadHooks(): Promise<PhraseyResult<true, Error>> {
        const hooks = new PhraseyHooks(this.phrasey);
        for (const x of this.config.z.hooks?.files ?? []) {
            const hookPath = this.phrasey.path(x.path);
            const hookResult = hooks.addHandlerFile(hookPath, x.options ?? {});
            if (!hookResult.success) {
                return hookResult;
            }
        }
        this.state.setHooks(hooks);
        return { success: true, data: true };
    }

    async loadLocales(): Promise<PhraseyResult<true, Error>> {
        const beforeHookResult = await this.hooks.dispatch(
            "beforeLocalesParsing",
            this.state,
            {},
        );
        if (!beforeHookResult.success) {
            return beforeHookResult;
        }
        if (this.config.z.locales) {
            const path = this.phrasey.path(this.config.z.locales.file);
            const result = await PhraseyLocales.create(
                path,
                this.config.z.locales.format,
            );
            if (!result.success) {
                return result;
            }
            this.state.setLocales(result.data);
        } else {
            const locales = PhraseyLocales.defaultLocales();
            this.state.setLocales(locales);
        }
        const afterHookResult = await this.hooks.dispatch(
            "onLocalesParsed",
            this.state,
            {},
        );
        if (!afterHookResult.success) {
            return afterHookResult;
        }
        return { success: true, data: true };
    }

    async loadTranslations(): Promise<PhraseyResult<true, Error | Error[]>> {
        const beforeHookResult = await this.hooks.dispatch(
            "beforeTranslationsParsing",
            this.state,
            {},
        );
        if (!beforeHookResult.success) {
            return beforeHookResult;
        }
        const formatter = PhraseyContentFormats.resolve(
            this.config.z.input.format,
        );
        const globalFallback = PhraseyUtils.parseStringArrayNullable(
            this.config.z.input.fallback,
        ).map((x) => this.phrasey.path(x));
        const stream = FastGlob.stream(this.config.z.input.files, {
            cwd: this.phrasey.cwd,
            absolute: true,
            dot: true,
            onlyFiles: true,
        });
        const errors: Error[] = [];
        for await (const x of stream) {
            const path = x.toString();
            const result = await this.loadTranslation(
                path,
                formatter,
                globalFallback,
            );
            if (!result.success) {
                errors.push(result.error);
            }
        }
        if (errors.length > 0) {
            return { success: false, error: errors };
        }
        const afterHookResult = await this.hooks.dispatch(
            "onTranslationsParsed",
            this.state,
            {},
        );
        if (!afterHookResult.success) {
            return afterHookResult;
        }
        return { success: true, data: true };
    }

    async loadTranslation(
        path: string,
        formatter: PhraseyContentFormatter,
        globalFallback: string[],
    ): Promise<PhraseyResult<true, Error>> {
        const beforeHookResult = await this.hooks.dispatch(
            "beforeTranslationParsing",
            this.state,
            {},
        );
        if (!beforeHookResult.success) {
            return beforeHookResult;
        }
        const result = await this.translations.load(
            path,
            formatter,
            this.locales,
            globalFallback,
        );
        if (!result.success) {
            return result;
        }
        const afterHookResult = await this.hooks.dispatch(
            "onTranslationParsed",
            this.state,
            { locale: result.data },
        );
        if (!afterHookResult.success) {
            return afterHookResult;
        }
        return { success: true, data: true };
    }

    async ensureTranslations(): Promise<PhraseyResult<true, Error | Error[]>> {
        const beforeHookResult = await this.hooks.dispatch(
            "beforeTranslationsEnsuring",
            this.state,
            {},
        );
        if (!beforeHookResult.success) {
            return beforeHookResult;
        }
        const errors: Error[] = [];
        for (const x of this.translations.values()) {
            const result = await this.ensureTranslation(x);
            if (!result.success) {
                errors.push(result.error);
            }
        }
        if (errors.length > 0) {
            return { success: false, error: errors };
        }
        const afterHookResult = await this.hooks.dispatch(
            "onTranslationsEnsured",
            this.state,
            {},
        );
        if (!afterHookResult.success) {
            return afterHookResult;
        }
        return { success: true, data: true };
    }

    async ensureTranslation(
        translation: PhraseyTranslation,
    ): Promise<PhraseyResult<true, Error>> {
        const localeCode = translation.locale.code;
        const beforeHookResult = await this.hooks.dispatch(
            "beforeTranslationEnsuring",
            this.state,
            { locale: localeCode },
        );
        if (!beforeHookResult.success) {
            return beforeHookResult;
        }
        const result = this.translations.ensure(translation);
        if (!result.success) {
            return result;
        }
        const afterHookResult = await this.hooks.dispatch(
            "onTranslationEnsured",
            this.state,
            { locale: localeCode },
        );
        if (!afterHookResult.success) {
            return afterHookResult;
        }
        return { success: true, data: true };
    }

    async buildTranslations(): Promise<PhraseyResult<true, Error | Error[]>> {
        const beforeHookResult = await this.hooks.dispatch(
            "beforeTranslationsBuilding",
            this.state,
            {},
        );
        if (!beforeHookResult.success) {
            return beforeHookResult;
        }
        if (!this.config.z.output) {
            return {
                success: false,
                error: new PhraseyError(
                    `Cannot build when "output" is not specified in configuration file`,
                ),
            };
        }
        const formatter = PhraseyContentFormats.resolve(
            this.config.z.output.format,
        );
        const stringFormatter = PhraseyTranslationStringFormats.resolve(
            this.config.z.output.stringFormat,
        );
        const errors: Error[] = [];
        for (const x of this.translations.values()) {
            const path = this.phrasey.path(
                this.config.z.output.dir,
                `${x.locale.code}.${formatter.extension}`,
            );
            const result = await this.buildTranslation(
                path,
                x,
                formatter,
                stringFormatter,
            );
            if (!result.success) {
                errors.push(result.error);
            }
        }
        if (errors.length > 0) {
            return { success: false, error: errors };
        }
        const afterHookResult = await this.hooks.dispatch(
            "onTranslationsBuildFinished",
            this.state,
            {},
        );
        if (!afterHookResult.success) {
            return afterHookResult;
        }
        return { success: true, data: true };
    }

    async buildTranslation(
        path: string,
        translation: PhraseyTranslation,
        formatter: PhraseyContentFormatter,
        stringFormatter: PhraseyTranslationStringFormatter,
    ): Promise<PhraseyResult<true, Error>> {
        const localeCode = translation.locale.code;
        const beforeHookResult = await this.hooks.dispatch(
            "beforeTranslationBuilding",
            this.state,
            { locale: localeCode },
        );
        if (!beforeHookResult.success) {
            return beforeHookResult;
        }
        if (!translation.stats.isBuildable) {
            return {
                success: false,
                error: new PhraseyError(
                    `Translation "${localeCode}" is not buildable`,
                ),
            };
        }
        await ensureFile(path);
        const content = PhraseySafeRun(() =>
            formatter.serialize(translation.json(stringFormatter)),
        );
        if (!content.success) {
            return {
                success: false,
                error: new PhraseyWrappedError(
                    `Serializing "${localeCode}" failed`,
                    content.error,
                ),
            };
        }
        await writeFile(path, content.data);
        const afterHookResult = await this.hooks.dispatch(
            "onTranslationBuildFinished",
            this.state,
            { locale: localeCode },
        );
        if (!afterHookResult.success) {
            return afterHookResult;
        }
        return { success: true, data: true };
    }

    getSummary() {
        const summary = new PhraseySummary({
            keysCount: this.schema.keysCount(),
        });
        for (const x of this.translations.values()) {
            summary.add(x);
        }
        return summary;
    }

    constructBuildPipeline() {
        const pipeline = new PhraseyBuildablePipeline();
        pipeline.add(this.loadConfig.bind(this));
        pipeline.add(this.loadHooks.bind(this));
        pipeline.add(this.loadLocales.bind(this));
        pipeline.add(this.loadTranslations.bind(this));
        pipeline.add(this.ensureTranslations.bind(this));
        pipeline.add(this.buildTranslations.bind(this));
        return pipeline.build();
    }

    constructSummaryPipeline() {
        const pipeline = new PhraseyBuildablePipeline();
        pipeline.add(this.loadConfig.bind(this));
        pipeline.add(this.loadHooks.bind(this));
        pipeline.add(this.loadLocales.bind(this));
        pipeline.add(this.loadTranslations.bind(this));
        pipeline.add(this.ensureTranslations.bind(this));
        return pipeline.buildWithOutput(async () => {
            const summary = new PhraseySummary({
                keysCount: this.schema.keysCount(),
            });
            for (const x of this.translations.values()) {
                summary.add(x);
            }
            return { success: true, data: summary };
        });
    }

    get config() {
        return this.state.getConfig();
    }

    get hooks() {
        return this.state.getHooks();
    }

    get schema() {
        return this.state.getSchema();
    }

    get locales() {
        return this.state.getLocales();
    }

    get translations() {
        return this.state.getTranslations();
    }

    static create(options: PhraseyBuilderOptions) {
        const phrasey = new Phrasey({
            cwd: options.cwd,
            log: options.log,
            source: options.source,
        });
        const builder = new PhraseyBuilder(phrasey, options);
        return builder;
    }

    static async build(
        options: PhraseyBuilderOptions,
    ): Promise<PhraseyResult<true, Error | Error[]>> {
        const builder = PhraseyBuilder.create(options);
        const pipeline = builder.constructBuildPipeline();
        return pipeline.execute();
    }

    static async summary(
        options: PhraseyBuilderOptions,
    ): Promise<PhraseyResult<PhraseySummary, Error | Error[]>> {
        const builder = PhraseyBuilder.create(options);
        const pipeline = builder.constructSummaryPipeline();
        return pipeline.execute();
    }
}
