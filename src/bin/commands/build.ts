import { Command } from "commander";
import { PhraseyTreeLike } from "../../";
import { log } from "../utils";
import { createPhrasey } from "../steps/createPhrasey";
import { PhraseyConfigOptions } from "../steps/parsePhraseyOptions";

export const BuildCommand = new Command()
    .name("build")
    .description("Build the project.")
    .addOption(PhraseyConfigOptions.configFile)
    .addOption(PhraseyConfigOptions.configFormat)
    .action(async (options) => {
        const phrasey = await createPhrasey("build", options);
        await phrasey.load();
        if (phrasey.hasLoadErrors()) {
            log.error(`Build failed due to load error(s).`);
            log.grayed(PhraseyTreeLike.build(phrasey.loadErrors));
            log.ln();
            process.exit(1);
        }
        await phrasey.ensure();
        if (phrasey.hasEnsureErrors()) {
            log.error(`Build failed due to ensure error(s).`);
            log.grayed(PhraseyTreeLike.build(phrasey.ensureErrors));
            log.ln();
            process.exit(1);
        }
        await phrasey.build();
        if (phrasey.hasBuildErrors()) {
            log.error(`Build failed due to error(s).`);
            log.grayed(PhraseyTreeLike.build(phrasey.buildErrors));
            log.ln();
            process.exit(1);
        }
        log.success(`Build succeeded.`);
        log.ln();
    });
