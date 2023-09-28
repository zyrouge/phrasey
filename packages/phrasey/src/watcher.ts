import chokidar from "chokidar";
import fs from "fs-extra";
import { PhraseyBuilder, PhraseyBuilderOptions } from "./builder";
import { PhraseyError } from "./errors";
import { Phrasey, PhraseyOptions } from "./phrasey";
import { PhraseyState } from "./state";
import { PhraseyTranslations } from "./translations";
import { PhraseyUtils } from "./utils";

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

export type PhraseyChokidarWatcherListener = (
    eventName: "add" | "addDir" | "change" | "unlink" | "unlinkDir",
    path: string,
    stats?: fs.Stats,
) => void;

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
        this.configWatcher = PhraseyWatcher.createWatcher(configPath, () =>
            this.onConfigChange(),
        );
    }

    async updateConfig() {
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
                new PhraseyError("Updating config failed", {
                    cause: result.error,
                }),
            );
            return;
        }
        this.log.success("Synced config state.");

        const prevConfig = prevState.maybeGetConfig();
        const config = state.getConfig();
        const isLocalesUnchanged =
            prevState.hasLocales() &&
            PhraseyUtils.equals(prevConfig?.z.locales, config.z.locales);
        const isSchemaUnchanged =
            prevState.hasSchema() &&
            PhraseyUtils.equals(prevConfig?.z.schema, config.z.schema);
        const isTranslationsUnchanged =
            isLocalesUnchanged &&
            isSchemaUnchanged &&
            prevState.hasTranslations() &&
            PhraseyUtils.equals(prevConfig?.z.input, config.z.input) &&
            PhraseyUtils.equals(prevConfig?.z.output, config.z.output);
        if (isLocalesUnchanged) {
            state.setLocales(prevState.getLocales());
        } else {
            await this.onLocalesChange();
        }
        if (isSchemaUnchanged) {
            state.setSchema(prevState.getSchema());
        } else {
            await this.onSchemaChange();
        }
        if (isTranslationsUnchanged) {
            state.setTranslations(prevState.getTranslations());
        } else {
            await this.onTranslationsChange();
        }
        if (config.z.locales) {
            const localesPath = this.phrasey.path(config.z.locales.file);
            this.localesWatcher = PhraseyWatcher.createWatcher(
                localesPath,
                () => this.onLocalesChange(),
            );
        }
        const schemaPath = this.phrasey.path(config.z.schema.file);
        this.schemaWatcher = PhraseyWatcher.createWatcher(schemaPath, () =>
            this.onSchemaChange(),
        );
        const translationPaths = Array.isArray(config.z.input.files)
            ? config.z.input.files.map((x) => this.phrasey.path(x))
            : this.phrasey.path(config.z.input.files);
        this.translationsWatcher = PhraseyWatcher.createWatcher(
            translationPaths,
            (_, path) => this.onTranslationChange(path),
        );
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
                new PhraseyError("Updating locales failed", {
                    cause: result.error,
                }),
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
                new PhraseyError("Updating schema failed", {
                    cause: result.error,
                }),
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
                    new PhraseyError("Updating translations failed", {
                        cause: result.error,
                    }),
                );
                return;
            }
            this.log.success("Processed all translations.");
        }
        this.log.success("Synced translations state.");
    }

    async updateTranslation(path: string) {
        const rebuildPaths = new Set<string>();
        rebuildPaths.add(path);
        const translations = this.state.getTranslations();
        for (const x of translations.values()) {
            if (x.path === path) continue;
            if (x.fallback.includes(path)) {
                rebuildPaths.add(x.path);
            }
        }
        const builder = new PhraseyBuilder(this.phrasey, this.state, {
            ...this.options.builder,
            translations: {
                ...this.options.builder?.translations,
                skip: (x) => !rebuildPaths.has(x),
            },
        });
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
                new PhraseyError("Updating translation failed", {
                    cause: result.error,
                }),
            );
            return;
        }
        this.log.success(`Synced "${path}" translation state.`);
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
        this.log.info(`Triggering "${path}" translation change...`);
        await this.updateTranslation(path);
        await this.dispatch(async (x) => x.onTranslationChange?.(path));
    }

    async onError(error: Error) {
        this.log.error("Watcher encountered an error.");
        this.log.logErrors(error);
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
                    new PhraseyError("Event dispatching failed", {
                        cause: error,
                    }),
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

    static createWatcher(
        path: string | string[],
        listener: PhraseyChokidarWatcherListener,
    ) {
        const watcher = chokidar.watch(path, {
            ignoreInitial: true,
        });
        watcher.on("all", listener);
        return watcher;
    }
}
