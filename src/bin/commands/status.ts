import p from "path";
import { ensureFile, writeFile } from "fs-extra";
import { Command } from "commander";
import {
    PhraseyContentFormats,
    PhraseyTreeLike,
    PhraseySafeRun,
    PhraseyTranslationStatsJsonExtendedState,
} from "../..";
import { log, pico } from "../utils";
import { createPhrasey } from "../steps/createPhrasey";
import { PhraseyConfigOptions } from "../steps/parsePhraseyOptions";
import { symbolPostMap } from "./summary";

export const StatusCommand = new Command()
    .name("status")
    .description("View status of a translation.")
    .addOption(PhraseyConfigOptions.configFile)
    .addOption(PhraseyConfigOptions.configFormat)
    .option(`-i --input-file <path>`, "Path to input translation file")
    .option(`-o --output-file <path>`, "Path to output file")
    .option(`-s --output-format <format>`, "Output file format")
    .option(`-d --disable-output-print`, "Disable logging output data")
    .action(async (options) => {
        const inputFile: string = options.inputFile;
        if (!inputFile) {
            log.error(`Missing argument: ${pico.bold("input-file")}.`);
            log.ln();
            process.exit(1);
        }
        const outputFile: string = options.outputFile;
        const outputFormat: string = options.outputFormat ?? "console";
        const disableOutputPrint: string = options.disableOutputPrint || true;
        const phrasey = await createPhrasey("status", options);
        const inputFilePath = p.resolve(process.cwd(), inputFile);
        await phrasey.load({
            filter: (path) => path === inputFilePath,
        });
        if (phrasey.hasLoadErrors()) {
            log.error(`Status failed due to load error(s).`);
            log.grayed(PhraseyTreeLike.build(phrasey.loadErrors));
            log.ln();
            process.exit(1);
        }
        await phrasey.ensure();
        if (phrasey.hasEnsureErrors()) {
            log.error(`Status failed due to ensure error(s).`);
            log.grayed(PhraseyTreeLike.build(phrasey.ensureErrors));
            log.ln();
            process.exit(1);
        }
        const translation = [...phrasey.translations.values()].find(
            (x) => x.path === inputFilePath
        );
        if (!translation) {
            log.error(`Could not find results for "${inputFilePath}".`);
            log.ln();
            process.exit(1);
        }
        const stats = translation.stats.json();
        let serialized = "";
        switch (outputFormat) {
            case "console":
                printKV("Path", translation.path);
                printKV("Language", translation.locale.name);
                printKV("Locale", translation.locale.code);
                log.ln();
                printStateStats("Set Keys", stats.set, stats.total);
                printStateStats("Fallback Keys", stats.fallback, stats.total);
                printStateStats("Unset Keys", stats.unset, stats.total);
                printKVBool("Is buildable?", stats.isBuildable);
                printKVBool(
                    "Is standalone buildable?",
                    stats.isStandaloneBuildable
                );
                log.ln();
                if (outputFile) {
                    log.error(
                        `Default output format does not support saving to a file.`
                    );
                    log.ln();
                    process.exit(1);
                }
                break;

            default:
                const formatter = PhraseyContentFormats.resolve(outputFormat);
                const serializedResult = PhraseySafeRun(() => {
                    serialized = formatter.serialize(stats);
                });
                if (!serializedResult.success) {
                    log.error(`Serializing stats failed due to error.`);
                    log.grayed(PhraseyTreeLike.build([serializedResult.error]));
                    log.ln();
                    process.exit(1);
                }
                if (!disableOutputPrint) {
                    log.write(serialized);
                    log.ln();
                }
        }
        if (outputFile) {
            const outputFilePath = p.resolve(process.cwd(), outputFile);
            await ensureFile(outputFilePath);
            await writeFile(outputFilePath, serialized);
            log.success(`Generated "${outputFilePath}".`);
            log.ln();
        }
    });

function printKV(key: string, value: string) {
    log.write(`${key}: ${pico.bold(value)}`);
}

function printKVBool(key: string, value: boolean) {
    if (value) {
        log.write(`${key}: ${pico.bold(pico.green("Yes"))}`);
    } else {
        log.write(`${key}: ${pico.bold(pico.red("No"))}`);
    }
}

function printStateStats(
    title: string,
    state: PhraseyTranslationStatsJsonExtendedState,
    total: number
) {
    printKV(title, pico.magenta(`(${state.count}/${total})`));
    const tree = PhraseyTreeLike.build(state.keys, {
        symbolPostMap,
    });
    log.write(tree);
    log.ln();
}
