import fs from "fs-extra";
import { definePhraseyConfig, PhraseyCircuit } from "../src";

const config = definePhraseyConfig({
    rootDir: __dirname,
    input: {
        include: ["./i18n/**.yaml"],
    },
    defaultLocale: "en",
    keys: ["HelloThere", "ThankYou"] as const,
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
    const summary = await circuit.client.getFullSummary();
    for (const x of Object.values(summary)) {
        console.log(
            `Summary of ${x.translation.language} (${x.translation.path})`
        );
        console.log(`Buildable: ${x.isBuildable}`);
        console.log(`Standalone Buildable: ${x.isStandaloneBuildable}`);
        console.log(`Keys: ${x.isStandaloneBuildable}`);
        for (const [key, state] of Object.entries(x.keys.states)) {
            console.log(` - ${key}: ${state}`);
        }
        console.log(`Keys total: ${x.keys.total}`);
        console.log(`Keys set: ${x.keys.set}`);
        console.log(`Keys defaulted: ${x.keys.defaulted}`);
        console.log(`Keys unset: ${x.keys.unset}`);
        console.log("");
    }
    await circuit.build();
};

start();
