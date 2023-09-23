const p = require("path");
const { writeFile } = require("fs/promises");
const { PhraseyLocaleBuilder } = require("@zyrouge/phrasey-locales-builder");

const outputFile = p.resolve(__dirname, `../src/data.json`);

const start = async () => {
    const localeCodes = await PhraseyLocaleBuilder.build({
        displayLocaleCode: "en",
    });
    await writeFile(outputFile, JSON.stringify(localeCodes));
};

start();
