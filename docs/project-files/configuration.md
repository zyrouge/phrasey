# Configuration File

## Representation

```ts
interface PhraseyConfig {
    input: {
        files: string | string[];
        format: string;
        default?: string;
    };
    schema: {
        file: string;
        format: string;
    };
    output?: {
        dir: string;
        format: string;
        stringFormat: string;
    };
    hooks?: string[];
}
```

## Example

```yaml
schema:
    path: ./i18n-schema.yaml
    format: yaml

input:
    files: ./i18n/**.yaml
    default: ./i18n/en.yaml
    format: yaml

output:
    dir: ./dist
    format: json
    stringFormat: parts

hooks:
    - ./hooks.js
```
