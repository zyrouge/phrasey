# Configuration File

The configuration file helps the CLI to build the project.

## Representation

```ts
interface PhraseyZConfigType {
    input: {
        // supports globs
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
    hooks?: {
        files: string[];
    };
}
```

## Example

```yaml
schema:
    file: ./i18n-schema.yaml
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
    files:
        - ./hooks.js
```
