import chokidar from "chokidar";
import { Phrasey, PhraseyOptions } from "./phrasey";
import { PhraseyState } from "./state";
import { PhraseyBuilder, PhraseyBuilderOptions } from "./builder";
import { PhraseyTranslations } from "./translations";
import { PhraseyWrappedError } from "./errors";
import { pico } from "./bin/utils/log";

export interface PhraseyWatcherOptions {
    phrasey: PhraseyOptions;
    builder: PhraseyBuilderOptions;
    watcher: {
        buildAllTranslations?: boolean;
    };
}

export interface PhraseyWatcherCompleteListener {
    onConfigChange(): Promise<void>;
    onLocalesChange(): Promise<void>;
    onSchemaChange(): Promise<void>;
    onTranslationsChange(): Promise<void>;
    onTranslationChange(path: string): Promise<void>;
    onError(error: Error): Promise<void>;
}

export type PhraseyWatcherListener = Partial<PhraseyWatcherCompleteListener>;

export class PhraseyWatcher {
    listeners: PhraseyWatcherListener[] = [];

    phrasey: Phrasey;
    state: PhraseyState;

    configWatcher?: chokidar.FSWatcher;
    localesWatcher?: chokidar.FSWatcher;
    schemaWatcher?: chokidar.FSWatcher;
    translationsWatcher?: chokidar.FSWatcher;

    constructor(public options: PhraseyWatcherOptions) {
        this.phrasey = new Phrasey(this.options.phrasey);
        this.state = new PhraseyState(this.phrasey);
    }

    async initialize() {
        await this.updateConfig();
        const configPath = this.phrasey.path(this.options.builder.config.file);
        this.configWatcher = chokidar
            .watch(configPath)
            .on("all", () => this.onConfigChange());
    }

    async updateConfig() {
        await this.configWatcher?.close();
        delete this.configWatcher;
        await this.localesWatcher?.close();
        delete this.localesWatcher;
        await this.schemaWatcher?.close();
        delete this.schemaWatcher;
        await this.translationsWatcher?.close();
        delete this.translationsWatcher;

        const state = new PhraseyState(this.phrasey);
        const prevState = this.state;
        this.state = state;
        const builder = new PhraseyBuilder(
            this.phrasey,
            state,
            this.options.builder,
        );
        const pipeline = builder.constructPipeline({
            loadConfig: true,
            loadHooks: true,
            loadLocales: false,
            loadSchema: false,
            loadTranslations: false,
            ensureTranslations: false,
            buildTranslations: false,
        });
        const result = await pipeline.execute();
        if (!result.success) {
            await this.onError(
                new PhraseyWrappedError("Updating config failed", result.error),
            );
            return;
        }
        this.log.success("Synced config state.");
        const prevConfig = prevState.maybeGetConfig();
        const config = state.getConfig();
        if (
            !prevConfig ||
            prevConfig?.z.locales?.file !== config.z.locales?.file ||
            prevConfig?.z.locales?.format !== config.z.locales?.format
        ) {
            await this.onLocalesChange();
        }
        if (
            prevConfig?.z.schema?.file !== config.z.schema?.file ||
            prevConfig?.z.schema?.format !== config.z.schema?.format
        ) {
            await this.onSchemaChange();
        }
        if (
            (Array.isArray(prevConfig?.z.input.files) &&
            Array.isArray(config.z.input.files)
                ? prevConfig?.z.input.files.join() !==
                  config.z.input.files.join()
                : prevConfig?.z.input?.files !== config.z.input?.files) ||
            prevConfig?.z.input?.format !== config.z.input?.format
        ) {
            await this.onTranslationsChange();
        }
        if (config.z.locales) {
            const localesPath = this.phrasey.path(config.z.locales.file);
            this.localesWatcher = chokidar
                .watch(localesPath)
                .on("all", () => this.onLocalesChange());
        }
        const schemaPath = this.phrasey.path(config.z.schema.file);
        this.schemaWatcher = chokidar
            .watch(schemaPath)
            .on("all", () => this.onSchemaChange());
        const translationPaths = Array.isArray(config.z.input.files)
            ? config.z.input.files.map((x) => this.phrasey.path(x))
            : this.phrasey.path(config.z.input.files);
        this.translationsWatcher = chokidar
            .watch(translationPaths)
            .on("all", (_, path) => this.onTranslationChange(path));
    }

    async updateLocales() {
        const builder = new PhraseyBuilder(
            this.phrasey,
            this.state,
            this.options.builder,
        );
        const pipeline = builder.constructPipeline({
            loadConfig: false,
            loadHooks: false,
            loadLocales: true,
            loadSchema: false,
            loadTranslations: false,
            ensureTranslations: false,
            buildTranslations: false,
        });
        const result = await pipeline.execute();
        if (!result.success) {
            await this.onError(
                new PhraseyWrappedError(
                    "Updating locales failed",
                    result.error,
                ),
            );
            return;
        }
        this.log.success("Synced locales state.");
    }

    async updateSchema() {
        const builder = new PhraseyBuilder(
            this.phrasey,
            this.state,
            this.options.builder,
        );
        const pipeline = builder.constructPipeline({
            loadConfig: false,
            loadHooks: false,
            loadLocales: false,
            loadSchema: true,
            loadTranslations: false,
            ensureTranslations: false,
            buildTranslations: false,
        });
        const result = await pipeline.execute();
        if (!result.success) {
            await this.onError(
                new PhraseyWrappedError("Updating schema failed", result.error),
            );
            return;
        }
        this.log.success("Synced schema state.");
    }

    async updateTranslations() {
        this.state.setTranslations(
            new PhraseyTranslations(this.state.getSchema()),
        );
        if (this.options.watcher.buildAllTranslations) {
            const builder = new PhraseyBuilder(
                this.phrasey,
                this.state,
                this.options.builder,
            );
            const pipeline = builder.constructPipeline({
                loadConfig: false,
                loadHooks: false,
                loadLocales: false,
                loadSchema: false,
                loadTranslations: true,
                ensureTranslations: true,
                buildTranslations: true,
            });
            const result = await pipeline.execute();
            if (!result.success) {
                await this.onError(
                    new PhraseyWrappedError(
                        "Updating translations failed",
                        result.error,
                    ),
                );
                return;
            }
            this.log.success("Processed all translations.");
        }
        this.log.success("Synced translations state.");
    }

    async onConfigChange() {
        this.log.info("Triggering config change...");
        await this.updateConfig();
        await this.dispatch(async (x) => x.onConfigChange?.());
    }

    async onLocalesChange() {
        this.log.info("Triggering locales change...");
        await this.updateLocales();
        await this.dispatch(async (x) => x.onLocalesChange?.());
    }

    async onSchemaChange() {
        this.log.info("Triggering schema change...");
        await this.updateSchema();
        await this.dispatch(async (x) => x.onSchemaChange?.());
    }

    async onTranslationsChange() {
        this.log.info("Triggering translations change...");
        await this.updateTranslations();
        await this.dispatch(async (x) => x.onTranslationsChange?.());
    }

    async onTranslationChange(path: string) {
        this.log.info(
            `Triggering translation change... ${pico.gray(`(${path})`)}`,
        );
        await this.dispatch(async (x) => x.onTranslationChange?.(path));
    }

    async onError(error: Error) {
        this.log.error(`${error}`);
        await this.dispatch(async (x) => x.onError?.(error));
    }

    async destroy() {
        await this.configWatcher?.close();
        delete this.configWatcher;
        await this.localesWatcher?.close();
        delete this.localesWatcher;
        await this.schemaWatcher?.close();
        delete this.schemaWatcher;
        await this.translationsWatcher?.close();
        delete this.translationsWatcher;
    }

    listen(listener: PhraseyWatcherListener) {
        this.listeners.push(listener);
        return () => this.unlisten(listener);
    }

    unlisten(listener: PhraseyWatcherListener) {
        this.listeners = this.listeners.filter((x) => x !== listener);
    }

    async dispatch(apply: (listener: PhraseyWatcherListener) => Promise<void>) {
        for (const x of this.listeners) {
            try {
                await apply(x);
            } catch (error) {
                await this.onError(
                    new PhraseyWrappedError("Event dispatching failed", error),
                );
            }
        }
    }

    get log() {
        return this.phrasey.log;
    }

    static async create(options: PhraseyWatcherOptions) {
        const watcher = new PhraseyWatcher(options);
        await watcher.initialize();
        return watcher;
    }
}
