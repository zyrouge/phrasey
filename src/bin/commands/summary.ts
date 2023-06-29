import p from "path";
import { ensureFile, writeFile } from "fs-extra";
import { Command } from "commander";
import {
    PhraseyContentFormats,
    PhraseyTranslationStatsJson,
    PhraseyTreeLike,
    PhraseySafeRun,
    PhraseySummaryJsonTotalStats,
} from "../..";
import { log, pico } from "../utils";
import { createPhrasey } from "../steps/createPhrasey";
import { PhraseyConfigOptions } from "../steps/parsePhraseyOptions";

export const SummaryCommand = new Command()
    .name("summary")
    .description("Generate summary of the project.")
    .addOption(PhraseyConfigOptions.configFile)
    .addOption(PhraseyConfigOptions.configFormat)
    .option(`-o --output-file <path>`, "Path to output file")
    .option(`-s --output-format <format>`, "Output file format")
    .option(`-d --disable-output-print`, "Disable logging output data")
    .action(async (options) => {
        const outputFile: string = options.outputFile;
        const outputFormat: string = options.outputFormat ?? "console";
        const disableOutputPrint: string = options.disableOutputPrint || true;
        const phrasey = await createPhrasey("summary", options);
        await phrasey.load();
        if (phrasey.hasLoadErrors()) {
            log.error(`Load failed due to error(s).`);
            log.grayed(PhraseyTreeLike.build(phrasey.loadErrors));
            log.ln();
            process.exit(1);
        }
        const summary = phrasey.prepareSummary();
        const data = summary.json();
        let serialized = "";
        switch (outputFormat) {
            case "console":
                log.write(pico.bold("Total"));
                printTotalStatsTree(data.total);
                log.ln();
                log.write(pico.bold("Individual"));
                Object.entries(data.individual).forEach(([k, v]) => {
                    const { isBuildable } = summary.individualStats.get(k)!;
                    const titleTree = PhraseyTreeLike.build(
                        [pico.bold(isBuildable ? pico.green(k) : pico.red(k))],
                        { symbolPostMap }
                    );
                    log.write(titleTree);
                    printIndividualStatsTree(v);
                });
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
                const serializer =
                    PhraseyContentFormats.resolveSerializer(outputFormat);
                const serializedResult = PhraseySafeRun(() => {
                    serialized = serializer.serialize(data);
                });
                if (!serializedResult.success) {
                    log.error(`Serializing summary failed due to error.`);
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

export const symbolPostMap = (symbol: string) => pico.gray(symbol);

function printTotalStatsTree(stats: PhraseySummaryJsonTotalStats) {
    const data = [
        `Set     : ${stats.set}`,
        `Default : ${stats.defaulted}`,
        `Unset   : ${stats.unset}`,
        `Total   : ${stats.total}`,
    ];
    const tree = PhraseyTreeLike.build(data, {
        symbolPostMap,
    });
    log.write(tree);
}

function printIndividualStatsTree(stats: PhraseyTranslationStatsJson) {
    const p = (value: number) => `${value.toPrecision(3)}%`;
    const data = [
        `Set     : ${stats.set.count} (${p(stats.set.percent)})`,
        `Default : ${stats.defaulted.count} (${p(stats.defaulted.percent)})`,
        `Unset   : ${stats.unset.count} (${p(stats.unset.percent)})`,
        `Total   : ${stats.total}`,
    ];
    const tree = PhraseyTreeLike.build(data, {
        prefix: PhraseyTreeLike.tab(1),
        symbolPostMap,
    });
    log.write(tree);
}
