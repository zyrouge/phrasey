# Translation String Formats

Translation string formats transform the parsed translation string into desirable output string.
They implement a formatter (converts `PhraseyTranslationStringParts` to any serializable `object`).

## Representation

```ts
interface PhraseyTranslationStringFormatter {
    format(
        parts: PhraseyTranslationStringParts,
        schema: PhraseySchemaKeyType
    ): any;
}
```

## Example

```js
import type { PhraseyTranslationStringFormatter } from "phrasey";

export const formatter: PhraseyTranslationStringFormatter = {
    format: (parts) => {
        let out = "";
        parts.forEach((x) => {
            switch (x.type) {
                case "string":
                    out += this.escapeCharacter(x.value, "{");
                    break;

                case "parameter":
                    out += `{${x.value}}`;
                    break;
            }
        });
        return out;
    },
};
```

## Pre-existing Formats

Phrasey has built-in support for the below formats.

### `parts`

Serializes the parsed string as it is.

Example of output string:

```json
[
    { "type": "string", "value": "Hello, " },
    { "type": "parameter", "value": "user" },
    { "type": "string", "value": "!" }
]
```

### `format-string`

Serializes the parsed string as to a equivalent of Python's `.format()` supported string.

Example of output string:

```
Hello, {user}!
```
