import chokidar from "chokidar";
import { Phrasey, PhraseyCreateOptions } from "./phrasey";
import { PhraseySchema } from "./schema";

export interface PhraseyWatcherOptions {
    createOptions: PhraseyCreateOptions;
}

export interface PhraseyWatcherCompleteListener {
    onClientInitialize(): Promise<void>;
    onConfigChange(): Promise<void>;
    onSchemaChange(): Promise<void>;
    onTranslationChange(path: string): Promise<void>;
}

export type PhraseyWatcherListener = Partial<PhraseyWatcherCompleteListener>;

export class PhraseyWatcher {
    listeners: PhraseyWatcherListener[] = [];

    phrasey!: Phrasey;
    configWatcher!: chokidar.FSWatcher;
    schemaWatcher!: chokidar.FSWatcher;
    translationsWatcher!: chokidar.FSWatcher;

    constructor(public options: PhraseyWatcherOptions) {}

    async initialize() {
        await this.initializeClient();
        this.configWatcher = chokidar
            .watch(this.options.createOptions.config.file)
            .on("all", () => this.onConfigChange());
    }

    async initializeClient() {
        const result = await Phrasey.create(this.options.createOptions);
        if (!result.success) {
            throw new Error("initializeClient");
        }
        const phrasey = result.data;
        this.schemaWatcher = chokidar
            .watch(phrasey.config.z.schema.file)
            .on("all", () => this.onSchemaChange());
        this.translationsWatcher = chokidar
            .watch(phrasey.config.z.input.files)
            .on("all", (_, path) => this.onTranslationChange(path));
        this.phrasey = phrasey;
        await this.dispatch(async (x) => x.onClientInitialize?.());
    }

    async onConfigChange() {
        await this.configWatcher.close();
        await this.schemaWatcher.close();
        await this.initializeClient();
        await this.dispatch(async (x) => x.onConfigChange?.());
    }

    async onSchemaChange() {
        const result = await PhraseySchema.create(
            this.phrasey.config.z.schema.file,
            this.phrasey.config.z.schema.format,
        );
        if (!result.success) {
            throw new Error("onSchemaChange");
        }
        const schema = result.data;
        this.phrasey.schema = schema;
        this.phrasey.translations.schema = schema;
        await this.dispatch(async (x) => x.onSchemaChange?.());
    }

    async onTranslationChange(path: string) {
        await this.dispatch(async (x) => x.onTranslationChange?.(path));
    }

    async destroy() {
        await this.configWatcher.close();
        await this.schemaWatcher.close();
        await this.translationsWatcher.close();
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
            await apply(x);
        }
    }

    get log() {
        return this.options.createOptions.log;
    }
}
