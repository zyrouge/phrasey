import { Command } from "commander";
import { log } from "../utils/log";
import {
    PhraseyCliConfigOptionFlags,
    parsePhraseyCliConfigOptions,
} from "../utils/parseConfigOptions";
import { PhraseyWatcher } from "../../";

export const WatchCommand = new Command()
    .name("watch")
    .description("Watch and build the project.")
    .addOption(PhraseyCliConfigOptionFlags.configFile)
    .addOption(PhraseyCliConfigOptionFlags.configFormat)
    .action(async (options) => {
        const configOptions = parsePhraseyCliConfigOptions(options);
        await PhraseyWatcher.create({
            phrasey: {
                cwd: configOptions.cwd,
                log,
                source: "build",
            },
            builder: {
                config: configOptions.config,
            },
            watcher: {
                buildAllTranslations: true,
            },
        });
    });
