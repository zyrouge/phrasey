import { Command } from "commander";
import { PhraseyTreeLike } from "../../utils";
import { PhraseyBuilder } from "../../builder";
import { log } from "../utils";
import {
    PhraseyCliConfigOptionFlags,
    parsePhraseyCliConfigOptions,
} from "../steps/parseConfigOptions";

export const BuildCommand = new Command()
    .name("build")
    .description("Build the project.")
    .addOption(PhraseyCliConfigOptionFlags.configFile)
    .addOption(PhraseyCliConfigOptionFlags.configFormat)
    .action(async (options) => {
        const configOptions = parsePhraseyCliConfigOptions(options);
        const result = await PhraseyBuilder.build({
            cwd: configOptions.cwd,
            config: configOptions.config,
            log,
            source: "build",
        });
        if (!result.success) {
            log.error("Build failed.");
            log.grayed(PhraseyTreeLike.build(result.error));
            log.ln();
            process.exit(1);
        }
        log.success("Build succeeded.");
        log.ln();
    });
