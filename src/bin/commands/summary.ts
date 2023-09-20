import p from "path";
import { ensureFile, writeFile } from "fs-extra";
import { Command } from "commander";
import {
    PhraseyTreeLike,
    PhraseySummaryJsonTotalStats,
    PhraseyTranslationStatsJson,
    PhraseyContentFormats,
    PhraseySafeRun,
    PhraseyBuilder,
} from "../../";
import { log, pico } from "../utils/log";
import {
    PhraseyCliConfigOptionFlags,
    parsePhraseyCliConfigOptions,
} from "../utils/parseConfigOptions";

export const SummaryCommand = new Command()
    .name("summary")
    .description("Build the project.")
    .addOption(PhraseyCliConfigOptionFlags.configFile)
    .addOption(PhraseyCliConfigOptionFlags.configFormat)
    .action(async (options) => {
        const outputFile: string = options.outputFile;
        const outputFormat: string = options.outputFormat ?? "console";
        const disableOutputPrint: string = options.disableOutputPrint || true;
        const configOptions = parsePhraseyCliConfigOptions(options);
        const result = await PhraseyBuilder.summary({
            phrasey: {
                cwd: configOptions.cwd,
                log,
                source: "summary",
            },
            builder: {
                config: configOptions.config,
            },
        });
        if (!result.success) {
            log.error("Summary failed.");
            log.grayed(PhraseyTreeLike.build(result.error));
            log.ln();
            process.exit(1);
        }
        const summary = result.data;
        const data = summary.json();
        let serialized = "";
        switch (outputFormat) {
            case "console":
                log.write(pico.bold("Full"));
                printFullStatsTree(data.full);
                log.ln();
                log.write(pico.bold("Individual"));
                Object.entries(data.individual).forEach(([k, v]) => {
                    const { isBuildable } = summary.individualStats.get(k)!;
                    const titleTree = PhraseyTreeLike.build(
                        [pico.bold(isBuildable ? pico.green(k) : pico.red(k))],
                        { symbolPostMap },
                    );
                    log.write(titleTree);
                    printIndividualStatsTree(v);
                });
                log.ln();
                if (outputFile) {
                    log.error(
                        `Default output format does not support saving to a file.`,
                    );
                    log.ln();
                    process.exit(1);
                }
                break;

            default:
                const formatter = PhraseyContentFormats.resolve(outputFormat);
                const serializedResult = PhraseySafeRun(() => {
                    serialized = formatter.serialize(data);
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

function printFullStatsTree(stats: PhraseySummaryJsonTotalStats) {
    const data = [
        `Set      : ${stats.setCount}`,
        `Fallback : ${stats.fallbackCount}`,
        `Unset    : ${stats.unsetCount}`,
        `Total    : ${stats.total}`,
        `Keys     : ${stats.keysCount}`,
    ];
    const tree = PhraseyTreeLike.build(data, {
        symbolPostMap,
    });
    log.write(tree);
}

function printIndividualStatsTree(stats: PhraseyTranslationStatsJson) {
    const p = (value: number) => `${value.toPrecision(3)}%`;
    const data = [
        `Set      : ${stats.set.count} (${p(stats.set.percent)})`,
        `Fallback : ${stats.fallback.count} (${p(stats.fallback.percent)})`,
        `Unset    : ${stats.unset.count} (${p(stats.unset.percent)})`,
        `Total    : ${stats.total}`,
    ];
    const tree = PhraseyTreeLike.build(data, {
        prefix: PhraseyTreeLike.tab(1),
        symbolPostMap,
    });
    log.write(tree);
}
