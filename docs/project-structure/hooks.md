# Hooks

Hooks can be used to do your own things during the build process.

Only javascript files can be specified since they are imported using `require`.

::: tip

Read the [API documentation](https://zyrouge.github.io/phrasey/api/) for more information.

:::

## Representation

```ts
interface PhraseyHooksPartialHandler {
    afterInit?(phrasey: Phrasey): Promise<void>;
    beforeLoad?(phrasey: Phrasey): Promise<void>;
    afterLoad?(phrasey: Phrasey): Promise<void>;
    beforeLoadTranslation?(phrasey: Phrasey): Promise<void>;
    afterLoadTranslation?(phrasey: Phrasey, locale: string): Promise<void>;
    beforeBuild?(phrasey: Phrasey): Promise<void>;
    afterBuild?(phrasey: Phrasey): Promise<void>;
    beforeBuildTranslation?(phrasey: Phrasey): Promise<void>;
    afterBuildTranslation?(phrasey: Phrasey, locale: string): Promise<void>;
}
```

## Example

```js
/**
 * @type {import("phrasey").PhraseyHooksPartialHandler}
 */
module.exports = {
    afterInit: (phrasey) => {
        console.log("event: afterInit");
    },
    beforeLoad: (phrasey) => {
        console.log("event: beforeLoad");
    },
    afterLoad: (phrasey) => {
        console.log("event: afterLoad");
    },
    beforeLoadTranslation: (phrasey) => {
        console.log("event: beforeLoadTranslation");
    },
    afterLoadTranslation: (phrasey, locale) => {
        console.log("event: afterLoadTranslation");
    },
    beforeBuild: (phrasey) => {
        console.log("event: beforeBuild");
    },
    afterBuild: (phrasey) => {
        console.log("event: afterBuild");
    },
    beforeBuildTranslation: (phrasey) => {
        console.log("event: beforeBuildTranslation");
    },
    afterBuildTranslation: (phrasey, locale) => {
        console.log("event: afterBuildTranslation");
    },
};
```
