const p = require("path");
const { writeFile } = require("fs-extra");

/**
 * @type {import("../src").PhraseyHooksHandler}
 */
const handler = {
    onSchemaParsed: async ({ phrasey, state, log }) => {
        if (!["build", "watch"].includes(phrasey.options.source)) {
            return;
        }
        try {
            const schema = state.getSchema();
            const modelPath = p.resolve(__dirname, "dist/model.d.ts");
            const content = `
export interface ITranslation {
    locale: {
        name: string;
        code: string;
    };

${schema.z.keys.map((x) => `    ${x.name}: [0 | 1, string][];`).join("\n")}
}

export interface Translation {
    locale: {
        name: string;
        code: string;
    };

${schema.z.keys
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
            log.error(`Generating model failed.`);
            log.logErrors(error);
        }
    },
};

module.exports = handler;
