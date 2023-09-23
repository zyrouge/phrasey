import p from "path";
import { writeFile } from "fs/promises";
import { PhraseyHooksHandler, PhraseyContentFormats } from "phrasey";
import { PhraseyLocaleBuilder } from "./builder";

class PhraseyLocaleBuilderOptionsError extends Error {
    constructor(option: string) {
        super(
            `phrasey-locales-builder: Missing or invalid "${option}" value in options`,
        );
    }
}

const hooks: PhraseyHooksHandler = {
    beforeLocalesParsing: async ({ phrasey, options, log }) => {
        const { displayLocaleCode, outputFile, outputFormat } = options;
        if (typeof displayLocaleCode !== "string") {
            throw new PhraseyLocaleBuilderOptionsError("displayLocaleCode");
        }
        if (typeof outputFile !== "string") {
            throw new PhraseyLocaleBuilderOptionsError("outputFile");
        }
        if (typeof outputFormat !== "string") {
            throw new PhraseyLocaleBuilderOptionsError("outputFormat");
        }
        const outputFilePath = phrasey.path(outputFile);
        const locales = await PhraseyLocaleBuilder.build({
            displayLocaleCode,
        });
        const formatter = PhraseyContentFormats.resolve(outputFormat);
        const content = formatter.serialize(locales);
        await writeFile(outputFilePath, content);
        log.success(`Generated "${p.resolve(phrasey.cwd, outputFilePath)}".`);
    },
};

export = hooks;
