import fs from "fs-extra";
import { phrasey, definePhraseyConfig } from "../src";

export const config = definePhraseyConfig({
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

phrasey(config);
