import { PhraseyError } from "./error";
import { PhraseyLogger } from "./logger";
import { Phrasey } from "./phrasey";

export type PhraseyHooksContext<T extends {}> = {
    phrasey: Phrasey;
    log: PhraseyLogger;
} & T;

export interface PhraseyHooksEvents {
    /** Fired when Phrasey client is created. */
    onCreate: {};
    /** Fired before loading translations. */
    beforeLoad: {};
    /** Fired after loading all translations. */
    afterLoad: {};
    /** Fired before loading a translation. */
    beforeLoadTranslation: {};
    /** Fired after loading a translation. */
    afterLoadTranslation: {
        locale: string;
    };
    /** Fired before ensuring all translations. */
    beforeEnsure: {};
    /** Fired after ensuring all translations. */
    afterEnsure: {};
    /** Fired before ensuring a translation. */
    beforeEnsureTranslation: {
        locale: string;
    };
    /** Fired after ensuring a translation. */
    afterEnsureTranslation: {
        locale: string;
    };
    /** Fired before building translations. */
    beforeBuild: {};
    /** Fired after building all translations. */
    afterBuild: {};
    /** Fired before building a translation. */
    beforeBuildTranslation: {
        locale: string;
    };
    /** Fired after building a translation. */
    afterBuildTranslation: {
        locale: string;
    };
}

export type PhraseyHooksEvent = keyof PhraseyHooksEvents;
export type PhraseyHooksEventContext<Event extends PhraseyHooksEvent> =
    PhraseyHooksContext<PhraseyHooksEvents[Event]>;

export type PhraseyHooksHandler = {
    [Event in PhraseyHooksEvent]?: (
        ctx: PhraseyHooksEventContext<Event>
    ) => Promise<void>;
};

export class PhraseyHooks {
    phrasey!: Phrasey;
    handlers: PhraseyHooksHandler[] = [];

    addHandlerFile(packagePath: string) {
        try {
            const handler: PhraseyHooksHandler = require(packagePath);
            this.addHandler(handler);
        } catch (err) {
            throw new PhraseyError(
                `Could not import hooks handler file "${packagePath}"`
            );
        }
    }

    addHandler(handler: PhraseyHooksHandler) {
        this.handlers.push(handler);
        return () => this.removeHandler(handler);
    }

    removeHandler(handler: PhraseyHooksHandler) {
        this.handlers = this.handlers.filter((x) => x !== handler);
    }

    bind(phrasey: Phrasey) {
        this.phrasey = phrasey;
    }

    async dispatch<Event extends PhraseyHooksEvent>(
        event: Event,
        data: PhraseyHooksEvents[Event]
    ) {
        const ctx: PhraseyHooksEventContext<Event> = {
            phrasey: this.phrasey,
            log: this.phrasey.log.inherit(`hooks:${event}`),
            ...data,
        };
        await Promise.allSettled(
            this.handlers.map(async (handler) => {
                const fn = handler[event];
                if (typeof fn === "function") {
                    await fn(ctx);
                }
            })
        );
    }
}
