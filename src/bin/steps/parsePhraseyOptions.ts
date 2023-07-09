import { Option } from "commander";
import { PhraseyCreateOptions } from "../../phrasey";
import { log, pico } from "../utils";

export const PhraseyConfigOptions = {
    configFile: new Option("-p --config-file <path>", "Path to config file"),
    configFormat: new Option(
        "-f --config-format <format>",
        "Config file format"
    ),
};

export const parsePhraseyOptions = (
    source: string,
    options: any
): PhraseyCreateOptions => {
    const configFile = options.configFile;
    if (!configFile) {
        log.error(`Missing argument: ${pico.bold("config-file")}.`);
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
            file: configFile,
            format: configFormat,
        },
        log,
        source,
    };
};
