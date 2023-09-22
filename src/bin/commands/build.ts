import { Command } from "commander";
import { PhraseyBuilder } from "../../";
import { log } from "../utils/log";
import {
    PhraseyCliConfigOptionFlags,
    parsePhraseyCliConfigOptions,
} from "../utils/parseConfigOptions";

export const BuildCommand = new Command()
    .name("build")
    .description("Build the project.")
    .addOption(PhraseyCliConfigOptionFlags.configFile)
    .addOption(PhraseyCliConfigOptionFlags.configFormat)
    .action(async (options) => {
        const configOptions = parsePhraseyCliConfigOptions(options);
        const result = await PhraseyBuilder.build({
            phrasey: {
                cwd: configOptions.cwd,
                log,
                source: "build",
            },
            builder: {
                config: configOptions.config,
            },
        });
        if (!result.success) {
            log.error("Build failed.");
            log.logErrors(result.error);
            log.ln();
            process.exit(1);
        }
        log.success("Build succeeded.");
        log.ln();
    });
