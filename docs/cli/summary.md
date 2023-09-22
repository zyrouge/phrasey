# Summary Command

`npx phrasey summary` can be used to generate summary of the project.

## Usage

```bash
npx phrasey summary \
    --config-file <path/to/config> \
    --config-format <format> \
    --output-file <path/to/output> \
    --output-format <format>
```

###### Arguments

-   `--config-file`, `-p` - Path to configuration file.
-   `--config-format`, `-f` - Format of the configuration file.
-   `--output-file`, `-o` - Path to output file.
-   `--output-format`, `-s` - Format of the output file.
-   `--help`, `-h` - Displays help message.

## Example

```bash
npx phrasey summary \
    --config-file ./phrasey-config.json \
    --config-format json \
    --output-file ./phrasey-summary.json \
    --output-format json
```
