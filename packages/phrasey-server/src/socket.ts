/* eslint-disable @typescript-eslint/no-empty-object-type */
import { PhraseyServer } from ".";

export interface SocketEvents {
    "config-updated": {};
    "locales-updated": {};
    "schema-updated": {};
    "translation-updated": {
        path: string;
    };
}

export const emitSocketEvent = <Event extends keyof SocketEvents>(
    server: PhraseyServer,
    event: Event,
    data: SocketEvents[Event],
) => {
    server.socket.emit(event, data);
};
