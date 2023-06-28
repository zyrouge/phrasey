# Translation String Formats

Translation string formats transform the parsed translation string into desirable output string.
They implement a formatter (converts `PhraseyTranslationStringParts` to a `string`).

## Representation

```ts
interface PhraseyTranslationStringFormatter {
    format(parts: PhraseyTranslationStringParts): any;
}
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
