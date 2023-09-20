const p = require("path");
const { writeFile } = require("fs-extra");
const pico = require("picocolors");

/**
 * @type {import("../src").PhraseyHooksHandler}
 */
const handler = {
    afterLoad: async ({ phrasey, log }) => {
        if (phrasey.options.source !== "build") return;
        try {
            const modelPath = p.resolve(__dirname, "dist/model.d.ts");
            const content = `
export interface ITranslation {
    locale: {
        name: string;
        code: string;
    };

${phrasey.schema.z.keys
    .map((x) => `    ${x.name}: [0 | 1, string][];`)
    .join("\n")}
}

export interface Translation {
    locale: {
        name: string;
        code: string;
    };

${phrasey.schema.z.keys
    .map((x) => {
        if (!x.parameters) {
            return `    ${x.name}: string;`;
        }
        const params = x.parameters.map((y) => `${y}: string`).join(", ");
        return `    ${x.name}(${params}): string;`;
    })
    .join("\n")}
}
        `.trim();
            await writeFile(modelPath, content);
            log.success(`Generated model "${modelPath}".`);
        } catch (error) {
            log.error(`Generating model failed. (Error: ${error})`);
        }
    },
};

module.exports = handler;
