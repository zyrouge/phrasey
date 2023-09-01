import { PhraseyError, PhraseyWrappedError } from "./error";
import { PhraseyLogger } from "./logger";
import { Phrasey } from "./phrasey";
import { PhraseyResult } from "./result";

export type PhraseyHooksContext<T extends {}> = {
    phrasey: Phrasey;
    log: PhraseyLogger;
    options: Record<string, any>;
} & T;

export interface PhraseyHooksEvents {
    onCreate: {};
    beforeLoad: {};
    afterLoad: {};
    beforeLoadLocales: {};
    afterLoadLocales: {};
    beforeLoadTranslation: {};
    afterLoadTranslation: { locale: string };
    beforeEnsure: {};
    afterEnsure: {};
    beforeEnsureTranslation: { locale: string };
    afterEnsureTranslation: { locale: string };
    beforeBuild: {};
    afterBuild: {};
    beforeBuildTranslation: { locale: string };
    afterBuildTranslation: { locale: string };
}

export type PhraseyHooksEvent = keyof PhraseyHooksEvents;
export type PhraseyHooksEventContext<Event extends PhraseyHooksEvent> =
    PhraseyHooksContext<PhraseyHooksEvents[Event]>;

export type PhraseyHooksHandler = {
    [Event in PhraseyHooksEvent]?: (
        ctx: PhraseyHooksEventContext<Event>,
    ) => Promise<void>;
};

export interface PhraseyHooksAttachedHandler {
    path: string;
    options: Record<string, any>;
    handler: PhraseyHooksHandler;
}

export class PhraseyHooks {
    phrasey!: Phrasey;
    handlers: PhraseyHooksAttachedHandler[] = [];

    addHandlerFile(path: string, options: Record<string, any>) {
        try {
            const handler: PhraseyHooksHandler = require(path);
            this.addHandler({ path, options, handler });
        } catch (err) {
            throw new PhraseyError(
                `Could not import hooks handler file "${path}"`,
            );
        }
    }

    addHandler(handler: PhraseyHooksAttachedHandler) {
        this.handlers.push(handler);
        return () => this.removeHandler(handler);
    }

    removeHandler(handler: PhraseyHooksAttachedHandler) {
        this.handlers = this.handlers.filter((x) => x !== handler);
    }

    bind(phrasey: Phrasey) {
        this.phrasey = phrasey;
    }

    async dispatch<Event extends PhraseyHooksEvent>(
        event: Event,
        data: PhraseyHooksEvents[Event],
    ): Promise<PhraseyResult<boolean, Error>> {
        const phrasey = this.phrasey;
        const log = this.phrasey.log.inherit(`hooks:${event}`);
        for (const { path, options, handler } of this.handlers) {
            const fn = handler[event];
            if (typeof fn === "function") {
                const ctx: PhraseyHooksEventContext<Event> = Object.assign(
                    { phrasey, log, options },
                    data,
                );
                try {
                    await fn(ctx);
                } catch (err) {
                    const rpath = this.phrasey.rpath(path);
                    return {
                        success: false,
                        error: new PhraseyWrappedError(
                            `Hook "${rpath}" handling "${event}" failed.`,
                            err,
                        ),
                    };
                }
            }
        }
        return { success: true, data: true };
    }
}
