const p = require("path");
const { writeFile } = require("fs-extra");
const pico = require("picocolors");

const logPrefix = pico.gray("[hooks:afterLoad]");

/**
 * @type {import("../src").PhraseyHooksHandler}
 */
const handler = {
    afterLoad: async (phrasey) => {
        try {
            const schema = phrasey.schema;
            const modelPath = p.resolve(__dirname, "dist/model.d.ts");
            const content = `
export interface ITranslation {
    locale: {
        name: string;
        code: string;
    }

${schema.keys
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
            console.log(`${logPrefix} Generated model "${modelPath}".`);
        } catch (err) {
            console.error(
                `${logPrefix} Generating model failed. (Error: ${err})`
            );
        }
    },
};

module.exports = handler;
