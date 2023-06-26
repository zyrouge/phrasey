import { Option } from "commander";
import { PhraseyCreateOptions } from "../../phrasey";
import { log, pico } from "../utils";

export const PhraseyConfigOptions = {
    configPath: new Option("-p --config-path <path>", "Path to config file"),
    configFormat: new Option(
        "-f --config-format <format>",
        "Config file format"
    ),
};

export const parsePhraseyOptions = (options: any): PhraseyCreateOptions => {
    const configPath = options.configPath;
    if (!configPath) {
        log.error(`Missing argument: ${pico.bold("config-path")}.`);
        log.ln();
        process.exit(1);
    }
    const configFormat = options.configFormat;
    if (!configFormat) {
        log.error(`Missing argument: ${pico.bold("config-format")}.`);
        log.ln();
        process.exit(1);
    }
    return {
        config: {
            path: configPath,
            format: configFormat,
        },
    };
};
