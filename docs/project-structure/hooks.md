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
    onCreate?(ctx: { phrasey: Phrasey; log: PhraseyLogger }): Promise<void>;

    beforeLoad?(ctx: { phrasey: Phrasey; log: PhraseyLogger }): Promise<void>;
    afterLoad?(ctx: { phrasey: Phrasey; log: PhraseyLogger }): Promise<void>;

    beforeLoadTranslation?(ctx: {
        phrasey: Phrasey;
        log: PhraseyLogger;
    }): Promise<void>;
    afterLoadTranslation?(ctx: {
        phrasey: Phrasey;
        log: PhraseyLogger;
        locale: string;
    }): Promise<void>;

    beforeEnsure?(ctx: { phrasey: Phrasey; log: PhraseyLogger }): Promise<void>;
    afterEnsure?(ctx: { phrasey: Phrasey; log: PhraseyLogger }): Promise<void>;

    beforeEnsureTranslation?(ctx: {
        phrasey: Phrasey;
        log: PhraseyLogger;
        locale: string;
    }): Promise<void>;
    afterEnsureTranslation?(ctx: {
        phrasey: Phrasey;
        log: PhraseyLogger;
        locale: string;
    }): Promise<void>;

    beforeBuild?(ctx: { phrasey: Phrasey; log: PhraseyLogger }): Promise<void>;
    afterBuild?(ctx: { phrasey: Phrasey; log: PhraseyLogger }): Promise<void>;

    beforeBuildTranslation?(ctx: {
        phrasey: Phrasey;
        log: PhraseyLogger;
        locale: string;
    }): Promise<void>;
    afterBuildTranslation?(ctx: {
        phrasey: Phrasey;
        log: PhraseyLogger;
        locale: string;
    }): Promise<void>;
}
```

## Example

```js
/**
 * @type {import("phrasey").PhraseyHooksHandler}
 */
module.exports = {
    onCreate: ({ phrasey, log }) => {
        log("Hello from the event onCreate!");
    },
    beforeLoad: ({ phrasey, log }) => {
        log("Hello from the event beforeLoad!");
    },
    afterLoad: ({ phrasey, log }) => {
        log("Hello from the event afterLoad!");
    },
    beforeLoadTranslation: ({ phrasey }) => {
        log("Hello from the event beforeLoadTranslation!");
    },
    afterLoadTranslation: ({ phrasey, log, locale }) => {
        log("Hello from the event afterLoadTranslation!");
    },
    beforeEnsure: ({ phrasey, log }) => {
        log("Hello from the event beforeEnsure!");
    },
    afterEnsure: ({ phrasey, log }) => {
        log("Hello from the event afterEnsure!");
    },
    beforeEnsureTranslation: ({ phrasey, log, locale }) => {
        log("Hello from the event beforeEnsureTranslation!");
    },
    afterEnsureTranslation: ({ phrasey, log, locale }) => {
        log("Hello from the event afterEnsureTranslation!");
    },
    beforeBuild: ({ phrasey, log }) => {
        log("Hello from the event beforeBuild!");
    },
    afterBuild: ({ phrasey, log }) => {
        log("Hello from the event afterBuild!");
    },
    beforeBuildTranslation: ({ phrasey, log, locale }) => {
        log("Hello from the event beforeBuildTranslation!");
    },
    afterBuildTranslation: ({ phrasey, log, locale }) => {
        log("Hello from the event afterBuildTranslation!");
    },
};
```
