import type {
    PhraseyConfigJson,
    PhraseySchemaJson,
    PhraseyTranslationJson,
} from "phrasey";

export { PhraseyConfigJson, PhraseySchemaJson, PhraseyTranslationJson };

export interface PhraseyBridgeRequestOptions {
    method: "GET" | "POST";
    path: string;
}

export interface PhraseyBridgeSuccessResponse<T> {
    success: true;
    data: T;
}

export interface PhraseyBridgeErrorResponse<E = string> {
    success: false;
    error: E;
}

export type PhraseyBridgeResponse<T, E = string> =
    | PhraseyBridgeSuccessResponse<T>
    | PhraseyBridgeErrorResponse<E>;

export class PhraseyBridge {
    constructor(public baseUrl: string) {}

    async getConfig() {
        return this._request<PhraseyConfigJson>({
            method: "GET",
            path: "/config/get",
        });
    }

    async getSchema() {
        return this._request<PhraseySchemaJson>({
            method: "GET",
            path: "/schema/get",
        });
    }

    async getTranslationFilePaths() {
        return this._request<string[]>({
            method: "GET",
            path: "/translation/file-paths",
        });
    }

    async _request<T, E = string>(options: PhraseyBridgeRequestOptions) {
        const url = this.baseUrl + options.path;
        const resp = await fetch(url, {
            method: options.method,
        });
        const body = await resp.json();
        return body as PhraseyBridgeResponse<T, E>;
    }
}

export const bridge = new PhraseyBridge(
    import.meta.env.VITE_PHRASEY_SERVER_URL,
);
