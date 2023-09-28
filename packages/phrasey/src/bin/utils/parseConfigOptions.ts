import p from "path";
import { Option } from "commander";
import { log, pico } from "./log";

export const PhraseyCliConfigOptionFlags = {
    configFile: new Option("-p --config-file <path>", "Path to config file"),
    configFormat: new Option(
        "-f --config-format <format>",
        "Config file format",
    ),
};

export interface PhraseyCliConfigOptions {
    cwd: string;
    config: {
        file: string;
        format: string;
    };
}

export const parsePhraseyCliConfigOptions = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: any,
): PhraseyCliConfigOptions => {
    if (!options.configFile) {
        log.error(`Missing argument: ${pico.bold("config-file")}.`);
        log.ln();
        process.exit(1);
    }
    const configFile = p.resolve(process.cwd(), options.configFile);
    const cwd = p.dirname(configFile);
    const configFormat = options.configFormat;
    if (!configFormat) {
        log.error(`Missing argument: ${pico.bold("config-format")}.`);
        log.ln();
        process.exit(1);
    }
    return {
        cwd,
        config: {
            file: configFile,
            format: configFormat,
        },
    };
};
