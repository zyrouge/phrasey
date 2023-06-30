# Content Formats

Content formats helps to understand the content of a file.
They implement serializer (converts content to an `object`) and deserializer (converts `object` to content) to provide functionality.

## Representation

```ts
interface PhraseyContentFormatter {
    extension: string;
    serialize(content: any): string;
    deserialize(content: string): any;
}
```

## Example

```js
import type { PhraseyContentFormatter } from "phrasey";

export const contentFormatter: PhraseyContentFormatter = {
    extension: "json",
    serialize: (content: any) => JSON.stringify(content),
    deserialize: (content: string) => JSON.parse(content),
};
```

## Pre-existing Formats

Phrasey has it's own implementation for the below formats.

### JSON

Supports serializing and deserializing `.json` files.

```bash
npm install --save-dev @zyrouge/phrasey-json
# or
yarn add --dev @zyrouge/phrasey-json
```

### YAML

Supports serializing and deserializing `.yaml` files. For file generation, the `.yaml` extension will only be used.

```bash
npm install --save-dev @zyrouge/phrasey-yaml
# or
yarn add --dev @zyrouge/phrasey-yaml
```

### TOML

Supports serializing and deserializing `.toml` files.

```bash
npm install --save-dev @zyrouge/phrasey-toml
# or
yarn add --dev @zyrouge/phrasey-toml
```

### XML

Supports serializing and deserializing `.xml` files.

```bash
npm install --save-dev @zyrouge/phrasey-xml
# or
yarn add --dev @zyrouge/phrasey-xml
```
