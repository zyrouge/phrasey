import { PhraseyWrappedError } from "./errors";
import { PhraseyLogger } from "./logger";
import { Phrasey } from "./phrasey";
import { PhraseyResult } from "./result";
import { PhraseyState } from "./state";

export type PhraseyHooksContext<T extends {}> = {
    phrasey: Phrasey;
    state: PhraseyState;
    log: PhraseyLogger;
    options: Record<string, any>;
} & T;

export interface PhraseyHooksEvents {
    onCreated: {};
    beforeLocalesParsing: {};
    onLocalesParsed: {};
    beforeSchemaParsing: {};
    onSchemaParsed: {};
    beforeTranslationsParsing: {};
    beforeTranslationParsing: {};
    onTranslationParsed: {
        locale: string;
    };
    onTranslationsParsed: {};
    beforeTranslationsEnsuring: {};
    beforeTranslationEnsuring: {};
    onTranslationEnsured: {
        locale: string;
    };
    onTranslationsEnsured: {};
    beforeTranslationsBuilding: {};
    beforeTranslationBuilding: {};
    onTranslationBuildFinished: {
        locale: string;
    };
    onTranslationsBuildFinished: {};
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
    handlers: PhraseyHooksAttachedHandler[] = [];

    constructor(public phrasey: Phrasey) {}

    addHandlerFile(
        path: string,
        options: Record<string, any>,
    ): PhraseyResult<true, Error> {
        try {
            const handler: PhraseyHooksHandler = require(path);
            this.addHandler({ path, options, handler });
            return { success: true, data: true };
        } catch (err) {
            return {
                success: false,
                error: new PhraseyWrappedError(
                    `Could not import hooks handler file "${path}"`,
                    err,
                ),
            };
        }
    }

    addHandler(handler: PhraseyHooksAttachedHandler) {
        this.handlers.push(handler);
        return () => this.removeHandler(handler);
    }

    removeHandler(handler: PhraseyHooksAttachedHandler) {
        this.handlers = this.handlers.filter((x) => x !== handler);
    }

    async dispatch<Event extends PhraseyHooksEvent>(
        event: Event,
        state: PhraseyState,
        data: PhraseyHooksEvents[Event],
    ): Promise<PhraseyResult<true, Error>> {
        const phrasey = this.phrasey;
        const log = this.phrasey.log.inherit(`hooks:${event}`);
        for (const { path, options, handler } of this.handlers) {
            const fn = handler[event];
            if (typeof fn === "function") {
                const ctx: PhraseyHooksEventContext<Event> = Object.assign(
                    { phrasey, state, log, options },
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
