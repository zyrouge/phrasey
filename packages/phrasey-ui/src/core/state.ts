import type { PhraseyConfigJson, PhraseySchemaJson } from "phrasey";
import { Accessor, Setter, createSignal } from "solid-js";
import { SetStoreFunction, Store, createStore } from "solid-js/store";
import { PhraseyBridgeResponse, bridge } from "./bridge";

export interface PhraseyStoreProps {
    config?: PhraseyConfigJson;
    schema?: PhraseySchemaJson;
    translationFilePaths?: string[];
}

export type PhraseyGlobalStateStatus = "waiting" | "ready" | "error";

export class PhraseyGlobalState {
    status: Accessor<PhraseyGlobalStateStatus>;
    setStatus: Setter<PhraseyGlobalStateStatus>;
    error: Accessor<string>;
    setError: Setter<string>;
    store: Store<PhraseyStoreProps>;
    setStore: SetStoreFunction<PhraseyStoreProps>;

    constructor() {
        [this.status, this.setStatus] =
            createSignal<PhraseyGlobalStateStatus>("waiting");
        [this.error, this.setError] = createSignal("");
        [this.store, this.setStore] = createStore({});
    }

    async initialize() {
        if (this.status() === "ready") {
            return;
        }
        const config = await gt(() => bridge.getConfig());
        const schema = await gt(() => bridge.getSchema());
        const translationFilePaths = await gt(() =>
            bridge.getTranslationFilePaths(),
        );
        this.setStore({ config, schema, translationFilePaths });
    }
}

export const globalState = new PhraseyGlobalState();

async function gt<T, E>(fn: () => Promise<PhraseyBridgeResponse<T, E>>) {
    const resp = await fn();
    if (!resp.success) {
        throw new Error(`${resp.error}`);
    }
    return resp.data;
}
