/* eslint-disable @typescript-eslint/ban-types */
import { PhraseyError } from "./errors";
import { PhraseyLogger } from "./logger";
import { Phrasey } from "./phrasey";
import { PhraseyResult } from "./result";
import { PhraseyState } from "./state";

export type PhraseyHooksContext<T extends {}> = {
    phrasey: Phrasey;
    state: PhraseyState;
    log: PhraseyLogger;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: Record<string, any>;
} & T;

export interface PhraseyHooksEvents {
    onCreated: {};
    beforeLocalesParsing: {};
    onLocalesParsed: {};
    beforeSchemaParsing: {};
    onSchemaParsed: {};
    beforeTranslationsParsing: {};
    beforeTranslationParsing: {
        path: string;
    };
    onTranslationParsed: {
        locale: string;
    };
    onTranslationsParsed: {};
    beforeTranslationsEnsuring: {};
    beforeTranslationEnsuring: {
        locale: string;
    };
    onTranslationEnsured: {
        locale: string;
    };
    onTranslationsEnsured: {};
    beforeTranslationsBuilding: {};
    beforeTranslationBuilding: {
        locale: string;
    };
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: Record<string, any>;
    handler: PhraseyHooksHandler;
}

export class PhraseyHooks {
    handlers: PhraseyHooksAttachedHandler[] = [];

    constructor(public phrasey: Phrasey) {}

    addHandlerFile(
        path: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        options: Record<string, any>,
    ): PhraseyResult<true, Error> {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const handler: PhraseyHooksHandler = require(path);
            this.addHandler({ path, options, handler });
            return { success: true, data: true };
        } catch (error) {
            return {
                success: false,
                error: new PhraseyError(
                    `Could not import hooks handler file "${path}"`,
                    { cause: error },
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
                } catch (error) {
                    const rpath = this.phrasey.rpath(path);
                    return {
                        success: false,
                        error: new PhraseyError(
                            `Hook "${rpath}" handling "${event}" failed.`,
                            { cause: error },
                        ),
                    };
                }
            }
        }
        return { success: true, data: true };
    }
}
