# Hooks

Hooks can be used to do your own things during the build process.

Only javascript files can be specified since they are imported using `require`.

::: tip

Read the [API documentation](https://zyrouge.github.io/phrasey/api/) for more information.

:::

::: tip

You can use `phrasey.options.source` to find which command was invoked.

:::

## Representation

```ts
interface PhraseyHooksHandler {
    onCreated?(ctx: {
        phrasey: Phrasey;
        state: PhraseyState;
        log: PhraseyLogger;
        options: Record<string, any>;
    }): Promise<void>;

    beforeLocalesParsing?(ctx: {
        phrasey: Phrasey;
        state: PhraseyState;
        log: PhraseyLogger;
        options: Record<string, any>;
    }): Promise<void>;

    onLocalesParsed?(ctx: {
        phrasey: Phrasey;
        state: PhraseyState;
        log: PhraseyLogger;
        options: Record<string, any>;
    }): Promise<void>;

    beforeSchemaParsing?(ctx: {
        phrasey: Phrasey;
        state: PhraseyState;
        log: PhraseyLogger;
        options: Record<string, any>;
    }): Promise<void>;

    onSchemaParsed?(ctx: {
        phrasey: Phrasey;
        state: PhraseyState;
        log: PhraseyLogger;
        options: Record<string, any>;
    }): Promise<void>;

    beforeTranslationsParsing?(ctx: {
        phrasey: Phrasey;
        state: PhraseyState;
        log: PhraseyLogger;
        options: Record<string, any>;
    }): Promise<void>;

    beforeTranslationParsing?(ctx: {
        phrasey: Phrasey;
        state: PhraseyState;
        log: PhraseyLogger;
        options: Record<string, any>;

        path: string;
    }): Promise<void>;

    onTranslationParsed?(ctx: {
        phrasey: Phrasey;
        state: PhraseyState;
        log: PhraseyLogger;
        options: Record<string, any>;

        locale: string;
    }): Promise<void>;

    onTranslationsParsed?(ctx: {
        phrasey: Phrasey;
        state: PhraseyState;
        log: PhraseyLogger;
        options: Record<string, any>;
    }): Promise<void>;

    beforeTranslationsEnsuring?(ctx: {
        phrasey: Phrasey;
        state: PhraseyState;
        log: PhraseyLogger;
        options: Record<string, any>;
    }): Promise<void>;

    beforeTranslationEnsuring?(ctx: {
        phrasey: Phrasey;
        state: PhraseyState;
        log: PhraseyLogger;
        options: Record<string, any>;

        locale: string;
    }): Promise<void>;

    onTranslationEnsured?(ctx: {
        phrasey: Phrasey;
        state: PhraseyState;
        log: PhraseyLogger;

        locale: string;
    }): Promise<void>;

    onTranslationsEnsured?(ctx: {
        phrasey: Phrasey;
        state: PhraseyState;
        log: PhraseyLogger;
        options: Record<string, any>;
    }): Promise<void>;

    beforeTranslationsBuilding?(ctx: {
        phrasey: Phrasey;
        state: PhraseyState;
        log: PhraseyLogger;
    }): Promise<void>;

    beforeTranslationBuilding?(ctx: {
        phrasey: Phrasey;
        state: PhraseyState;
        log: PhraseyLogger;

        locale: string;
    }): Promise<void>;

    onTranslationBuildFinished?(ctx: {
        phrasey: Phrasey;
        state: PhraseyState;
        log: PhraseyLogger;

        locale: string;
    }): Promise<void>;

    onTranslationsBuildFinished?(ctx: {
        phrasey: Phrasey;
        state: PhraseyState;
        log: PhraseyLogger;
    }): Promise<void>;
}
```

## Example

```js
/**
 * @type {import("phrasey").PhraseyHooksHandler}
 */
module.exports = {
    onCreated: ({ phrasey, state, log }) => {
        log("Hello from the event onCreated!");
    },
    beforeLocalesParsing: ({ phrasey, state, log }) => {
        log("Hello from the event beforeLocalesParsing!");
    },
    onLocalesParsed: ({ phrasey, state, log }) => {
        log("Hello from the event onLocalesParsed!");
    },
    beforeSchemaParsing: ({ phrasey }) => {
        log("Hello from the event beforeSchemaParsing!");
    },
    onSchemaParsed: ({ phrasey, state, log, locale }) => {
        log("Hello from the event onSchemaParsed!");
    },
    beforeTranslationsParsing: ({ phrasey, state, log }) => {
        log("Hello from the event beforeTranslationsParsing!");
    },
    beforeTranslationParsing: ({ phrasey, state, log, path }) => {
        log("Hello from the event beforeTranslationParsing!");
    },
    onTranslationParsed: ({ phrasey, state, log, locale }) => {
        log("Hello from the event onTranslationParsed!");
    },
    onTranslationsParsed: ({ phrasey, state, log }) => {
        log("Hello from the event onTranslationsParsed!");
    },
    beforeTranslationsEnsuring: ({ phrasey, state, log }) => {
        log("Hello from the event beforeTranslationsEnsuring!");
    },
    beforeTranslationEnsuring: ({ phrasey, state, log, locale }) => {
        log("Hello from the event beforeTranslationEnsuring!");
    },
    onTranslationEnsured: ({ phrasey, state, log, locale }) => {
        log("Hello from the event onTranslationEnsured!");
    },
    onTranslationsEnsured: ({ phrasey, state, log }) => {
        log("Hello from the event onTranslationsEnsured!");
    },
    beforeTranslationsBuilding: ({ phrasey, state, log }) => {
        log("Hello from the event beforeTranslationsBuilding!");
    },
    beforeTranslationBuilding: ({ phrasey, state, log, locale }) => {
        log("Hello from the event beforeTranslationBuilding!");
    },
    onTranslationBuildFinished: ({ phrasey, state, log, locale }) => {
        log("Hello from the event onTranslationBuildFinished!");
    },
    onTranslationsBuildFinished: ({ phrasey, state, log }) => {
        log("Hello from the event onTranslationsBuildFinished!");
    },
};
```
