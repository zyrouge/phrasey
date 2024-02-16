import Hapi from "@hapi/hapi";
import {
    Phrasey,
    PhraseyBuilderOptions,
    PhraseyOptions,
    PhraseyState,
    PhraseyWatcher,
} from "phrasey";
import { Server as SocketServer } from "socket.io";
import { configGetRoute } from "./routes/configGet";
import { configUpdateRoute } from "./routes/configUpdate";
import { schemaGetRoute } from "./routes/schemaGet";
import { schemaUpdateRoute } from "./routes/schemaUpdate";
import { translationFilePathsRoute } from "./routes/translationFilePaths";
import { translationUpdateRoute } from "./routes/translationUpdate";
import { emitSocketEvent } from "./socket";

export interface PhraseyServerOptions {
    phrasey: Exclude<PhraseyOptions, "source">;
    builder: PhraseyBuilderOptions;
    server?: {
        host?: string;
        port?: number;
    };
}

export interface PhraseyServerProps {
    options: PhraseyServerOptions;
    server: Hapi.Server;
    socket: SocketServer;
    phrasey: Phrasey;
    state: PhraseyState;
    watcher: PhraseyWatcher;
}

export class PhraseyServer implements PhraseyServerProps {
    options: PhraseyServerOptions;
    server: Hapi.Server;
    socket: SocketServer;
    phrasey: Phrasey;
    watcher: PhraseyWatcher;

    constructor(props: PhraseyServerProps) {
        this.options = props.options;
        this.server = props.server;
        this.server = props.server;
        this.socket = props.socket;
        this.phrasey = props.phrasey;
        this.watcher = props.watcher;
    }

    async initialize() {
        this.initializeApp();
        this.initializeSocket();
        this.initializeWatcher();
    }

    initializeApp() {
        configGetRoute(this);
        configUpdateRoute(this);
        schemaGetRoute(this);
        schemaUpdateRoute(this);
        translationFilePathsRoute(this);
        translationUpdateRoute(this);
    }

    initializeSocket() {
        this.socket.on("connection", (client) => {
            client.on("disconnect", () => {});
        });
    }

    async initializeWatcher() {
        await this.watcher.initialize();
        this.watcher.listen({
            onConfigChange: async () => {
                emitSocketEvent(this, "config-updated", {});
            },
            onLocalesChange: async () => {
                emitSocketEvent(this, "locales-updated", {});
            },
            onSchemaChange: async () => {
                emitSocketEvent(this, "schema-updated", {});
            },
            onTranslationChange: async (path) => {
                emitSocketEvent(this, "translation-updated", { path });
            },
        });
    }

    async start() {
        await this.server.start();
        this.log.info(
            `Server listening in http://${this.server.info.host}:${this.server.info.port}/`,
        );
    }

    get state() {
        return this.watcher.state;
    }

    get log() {
        return this.phrasey.log;
    }

    static createProps(options: PhraseyServerOptions): PhraseyServerProps {
        const server = Hapi.server({
            host: options.server?.host ?? "localhost",
            port: options.server?.port ?? 15324,
            debug: {
                request: ["error"],
            },
        });
        const socket = new SocketServer(server.listener);
        const phrasey = new Phrasey({
            ...options.phrasey,
            source: "watch",
        });
        const state = new PhraseyState(phrasey);
        const watcher = new PhraseyWatcher({
            phrasey: options.phrasey,
            builder: options.builder,
            watcher: {
                buildAllTranslations: true,
            },
        });
        return {
            options,
            server,
            socket,
            phrasey,
            state,
            watcher,
        };
    }

    static create(options: PhraseyServerOptions) {
        const props = this.createProps(options);
        const server = new PhraseyServer(props);
        return server;
    }

    static async start(options: PhraseyServerOptions) {
        const server = PhraseyServer.create(options);
        await server.initialize();
        await server.start();
        return server;
    }
}
