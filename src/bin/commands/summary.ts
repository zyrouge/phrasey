import p from "path";
import { ensureFile, writeFile } from "fs-extra";
import { Command } from "commander";
import {
    PhraseyContentFormats,
    PhraseyTranslationStatsJson,
    PhraseyTreeLike,
    safeRun,
} from "../..";
import { log, pico } from "../utils";
import { createPhrasey } from "../steps/createPhrasey";
import { PhraseyConfigOptions } from "../steps/parsePhraseyOptions";

export const SummaryCommand = new Command()
    .name("summary")
    .addOption(PhraseyConfigOptions.configPath)
    .addOption(PhraseyConfigOptions.configFormat)
    .option(`-o --output-format <format>`)
    .option(`-s --output-file <path>`)
    .action(async (options) => {
        const outputFormat: string = options.outputFormat ?? "console";
        const outputFile: string = options.outputFile;
        const phrasey = await createPhrasey(options);
        await phrasey.load();
        if (phrasey.hasLoadErrors()) {
            log.error(`Build failed due to load error(s).`);
            log.grayed(PhraseyTreeLike.build(phrasey.loadErrors));
            log.ln();
            process.exit(1);
        }
        const summary = phrasey.prepareSummary();
        const data = summary.json();
        let serialized = "";
        switch (outputFormat) {
            case "console":
                const symbolPostMap = (symbol: string) => pico.gray(symbol);
                const printStatsTree = (
                    stats: PhraseyTranslationStatsJson,
                    prefix: string = ""
                ) => {
                    const p = (value: number) => `${value.toPrecision(3)}%`;
                    const data = [
                        `Set     : ${stats.set} (${p(stats.setPercent)})`,
                        `Default : ${stats.defaulted} (${p(
                            stats.defaultedPercent
                        )})`,
                        `Unset   : ${stats.unset} (${p(stats.unsetPercent)})`,
                        `Total   : ${stats.total}`,
                    ];
                    const tree = PhraseyTreeLike.build(data, {
                        prefix,
                        symbolPostMap,
                    });
                    log.write(tree);
                };
                log.write(pico.bold("Total"));
                printStatsTree(data.totalStats);
                log.ln();
                log.write(pico.bold("Individual"));
                Object.entries(data.individualStats).forEach(([k, v]) => {
                    const { isBuildable } = summary.individualStats.get(k)!;
                    const titleTree = PhraseyTreeLike.build(
                        [pico.bold(isBuildable ? pico.green(k) : pico.red(k))],
                        { symbolPostMap }
                    );
                    log.write(titleTree);
                    printStatsTree(v, tab(1));
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
                const serializedResult = safeRun(() => {
                    serialized = serializer.serialize(data);
                });
                if (!serializedResult.success) {
                    log.error(`Serializing summary failed due to error.`);
                    log.grayed(PhraseyTreeLike.build([serializedResult.error]));
                    log.ln();
                    process.exit(1);
                }
                log.write(serialized);
                log.ln();
        }
        if (outputFile) {
            const outputFilePath = p.resolve(process.cwd(), outputFile);
            await ensureFile(outputFilePath);
            await writeFile(outputFilePath, serialized);
            log.success(`Generated "${outputFilePath}".`);
            log.ln();
        }
    });

function tab(count: number) {
    return "   ".repeat(count);
}
