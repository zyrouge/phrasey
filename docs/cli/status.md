# Status Command

`npx phrasey status` can be used to see the status of a translation.

## Usage

```bash
npx phrasey status \
    --config-file <path/to/config> \
    --config-format <format> \
    --input-file <path/to/translation> \
    --output-file <path/to/output> \
    --output-format <format>
```

###### Arguments

-   `--config-file`, `-p` - Path to configuration file.
-   `--config-format`, `-f` - Format of the configuration file.
-   `--input-file`, `-i` - Path to output file.
-   `--output-file`, `-o` - Path to output file.
-   `--output-format`, `-s` - Format of the output file.
-   `--help`, `-h` - Displays help message.

## Example

```bash
npx phrasey summary \
    --config-file ./phrasey-config.json \
    --config-format json \
    --input-file ./i18n/en.json \
    --output-file ./phrasey-en-status.json \
    --output-format json
```
