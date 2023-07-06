import { PhraseyError } from "./error";
import { Phrasey } from "./phrasey";

export interface PhraseyHooksHandler {
    /** Fired when Phrasey client is created. */
    onCreate(phrasey: Phrasey): Promise<void>;
    /** Fired before loading translations. */
    beforeLoad(phrasey: Phrasey): Promise<void>;
    /** Fired after loading all translations. */
    afterLoad(phrasey: Phrasey): Promise<void>;
    /** Fired before loading a translation. */
    beforeLoadTranslation(phrasey: Phrasey): Promise<void>;
    /** Fired after loading a translation. */
    afterLoadTranslation(phrasey: Phrasey, locale: string): Promise<void>;
    /** Fired before ensuring all translations. */
    beforeEnsure(phrasey: Phrasey): Promise<void>;
    /** Fired after ensuring all translations. */
    afterEnsure(phrasey: Phrasey): Promise<void>;
    /** Fired before ensuring a translation. */
    beforeEnsureTranslation(phrasey: Phrasey, locale: string): Promise<void>;
    /** Fired after ensuring a translation. */
    afterEnsureTranslation(phrasey: Phrasey, locale: string): Promise<void>;
    /** Fired before building translations. */
    beforeBuild(phrasey: Phrasey): Promise<void>;
    /** Fired after building all translations. */
    afterBuild(phrasey: Phrasey): Promise<void>;
    /** Fired before building a translation. */
    beforeBuildTranslation(phrasey: Phrasey, locale: string): Promise<void>;
    /** Fired after building a translation. */
    afterBuildTranslation(phrasey: Phrasey, locale: string): Promise<void>;
}

export type PhraseyHooksPartialHandler = Partial<PhraseyHooksHandler>;
export type PhraseyHooksEvent = keyof PhraseyHooksHandler;
export type PhraseyHooksEventParameters<
    Event extends keyof PhraseyHooksHandler
> = Parameters<PhraseyHooksHandler[Event]>;

export class PhraseyHooks {
    handlers: PhraseyHooksPartialHandler[] = [];

    addHandlerFile(packagePath: string) {
        try {
            const handler: PhraseyHooksPartialHandler = require(packagePath);
            this.addHandler(handler);
        } catch (err) {
            throw new PhraseyError(
                `Could not import hooks handler file "${packagePath}"`
            );
        }
    }

    addHandler(handler: PhraseyHooksPartialHandler) {
        this.handlers.push(handler);
        return () => this.removeHandler(handler);
    }

    removeHandler(handler: PhraseyHooksPartialHandler) {
        this.handlers = this.handlers.filter((x) => x !== handler);
    }

    async dispatch<Event extends PhraseyHooksEvent>(
        event: Event,
        ...args: PhraseyHooksEventParameters<Event>
    ) {
        await Promise.allSettled(
            this.handlers.map(async (handler) => {
                const fn = handler[event];
                if (typeof fn === "function") {
                    // @ts-expect-error
                    await fn(...args);
                }
            })
        );
    }
}
