# Content Formats

Content formats helps to understand the content of a file.
They implement a serializer (converts content to an `object`) or a deserializer (converts `object` to content) or both to provide functionality.

## Representation

```ts
interface PhraseyContentFormatSerializer {
    extension: string;
    serialize(content: any): string;
}

interface PhraseyContentFormatDeserializer {
    deserialize(content: string): any;
}
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

Supports serializing `.toml` files.

```bash
npm install --save-dev @zyrouge/phrasey-toml
# or
yarn add --dev @zyrouge/phrasey-toml
```

### XML

Supports serializing `.xml` files.

```bash
npm install --save-dev @zyrouge/phrasey-xml
# or
yarn add --dev @zyrouge/phrasey-xml
```
