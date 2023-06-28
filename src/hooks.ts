import { PhraseyError } from "./error";
import { Phrasey } from "./phrasey";

export interface PhraseyHooksHandler {
    onCreate(phrasey: Phrasey): Promise<void>;
    beforeLoad(phrasey: Phrasey): Promise<void>;
    afterLoad(phrasey: Phrasey): Promise<void>;
    beforeLoadTranslation(phrasey: Phrasey): Promise<void>;
    afterLoadTranslation(phrasey: Phrasey, locale: string): Promise<void>;
    beforeBuild(phrasey: Phrasey): Promise<void>;
    afterBuild(phrasey: Phrasey): Promise<void>;
    beforeBuildTranslation(phrasey: Phrasey): Promise<void>;
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
