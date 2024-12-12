# Watch Command

`npx phrasey watch` can be used to observe inputs and build continuously.

This command builds the whole project for once at the start.
Only changed inputs are built after it.

## Usage

```bash
npx phrasey watch \
    --config-file <path/to/config> \
    --config-format <format>
```

###### Arguments

- `--config-file`, `-p` - Path to configuration file.
- `--config-format`, `-f` - Format of the configuration file.
- `--help`, `-h` - Displays help message.

## Example

```bash
npx phrasey watch \
    --config-file ./phrasey-config.json \
    --config-format json
```
