const p = require("path");
const { copyFile } = require("fs/promises");
const { PhraseyLocaleBuilder } = require("@zyrouge/phrasey-locales-builder");

const inputFile = p.resolve(__dirname, `../src/data.json`);
const outputFile = p.resolve(__dirname, `../dist/data.json`);

const start = async () => {
    await copyFile(inputFile, outputFile);
};

start();
