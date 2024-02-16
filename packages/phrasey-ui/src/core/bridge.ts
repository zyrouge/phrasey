import type {
    PhraseyConfigJson,
    PhraseySchemaJson,
    PhraseyTranslationJson,
} from "phrasey";
import { SetStoreFunction, Store, createStore } from "solid-js/store";
import { jsonGet } from "./request";

export { PhraseyConfigJson, PhraseySchemaJson, PhraseyTranslationJson };

export interface PhraseyStoreProps {
    config: PhraseyConfigJson;
    schema: PhraseySchemaJson;
    translationFilePaths: string[];
}

export interface PhraseyBridgeOptions {
    host: string;
    port: string;
}

export class PhraseyBridge {
    ready = false;
    store!: Store<PhraseyStoreProps>;
    setStore!: SetStoreFunction<PhraseyStoreProps>;

    constructor(public options: PhraseyBridgeOptions) {}

    async initialize() {
        const config = await this.getConfig();
        const schema = await this.getSchema();
        const translationFilePaths = await this.getTranslationFilePaths();
        const [store, setStore] = createStore<PhraseyStoreProps>({
            config,
            schema,
            translationFilePaths,
        });
        this.store = store;
        this.setStore = setStore;
        this.ready = true;
        return store;
    }

    async getConfig() {
        return jsonGet<PhraseyConfigJson>(this.url("/config/get"));
    }

    async getSchema() {
        return jsonGet<PhraseySchemaJson>(this.url("/schema/get"));
    }

    async getTranslationFilePaths() {
        return jsonGet<string[]>(this.url("/translation/file-paths"));
    }

    url(route: string) {
        return `http://${this.options.host}:${this.options.port}${route}`;
    }

    static async create(options: PhraseyBridgeOptions) {
        const bridge = new PhraseyBridge(options);
        await bridge.initialize();
        return bridge;
    }
}
