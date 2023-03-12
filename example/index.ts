import fs from "fs-extra";
import { definePhraseyConfig, PhraseyCircuit } from "../src";

const config = definePhraseyConfig({
    rootDir: __dirname,
    input: {
        include: ["./i18n/**.yaml"],
    },
    defaultLocale: "en",
    keys: ["HelloThere", "ThankYou", "HowAreYou"] as const,
    transpile: {
        beforeOutput: async () => {
            await fs.rm(`${__dirname}/output-i18n`, {
                recursive: true,
                force: true,
            });
        },
        output: async (translation) => {
            const content = { ...translation } as any;
            delete content.path;
            return {
                path: `./output-i18n/${translation.locale}.json`,
                content: JSON.stringify(content, undefined, 4),
            };
        },
    },
});

const start = async () => {
    const circuit = PhraseyCircuit.create(config);
    await circuit.ensureParsed();
    const summary = await circuit.getFullSummary();
    for (const x of Object.values(summary.summary)) {
        console.log(
            `Summary of ${x.translation.language} (${x.translation.path})`
        );
        console.log(` > Buildable: ${x.isBuildable}`);
        console.log(` > Standalone Buildable: ${x.isStandaloneBuildable}`);
        console.log(` > Keys: ${x.isStandaloneBuildable}`);
        for (const [key, state] of Object.entries(x.keys.states)) {
            console.log(`    > ${key}: ${state}`);
        }
        console.log(` > Keys set: ${x.keys.set} (${x.keys.percents.set}%)`);
        console.log(
            ` > Keys defaulted: ${x.keys.defaulted} (${x.keys.percents.defaulted}%)`
        );
        console.log(
            ` > Keys unset: ${x.keys.unset} (${x.keys.percents.unset}%)`
        );
        console.log(` > Keys total: ${x.keys.total}`);
        console.log(
            ` > % translated: ${summary.keys.percents.setOrDefaulted}%`
        );
        console.log("");
    }
    console.log("Full Summary:");
    console.log(
        ` > Keys set: ${summary.keys.set} (${summary.keys.percents.set}%)`
    );
    console.log(
        ` > Keys defaulted: ${summary.keys.defaulted} (${summary.keys.percents.defaulted}%)`
    );
    console.log(
        ` > Keys unset: ${summary.keys.unset} (${summary.keys.percents.unset}%)`
    );
    console.log(` > Keys total: ${summary.keys.total}`);
    console.log(` > % translated: ${summary.keys.percents.setOrDefaulted}%`);
    console.log("");
    await circuit.build();
};

start();
