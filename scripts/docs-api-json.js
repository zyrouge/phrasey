const p = require("path");
const { spawnSync } = require("child_process");
const { gray } = require("picocolors");

const logPrefix = "[scripts/docs-api-json]";
const rootDir = p.resolve(__dirname, "..");
const subpackagesDir = p.join(rootDir, "subpackages");

const packageDirs = [
    rootDir,
    p.join(subpackagesDir, "phrasey-json"),
    p.join(subpackagesDir, "phrasey-locales"),
    p.join(subpackagesDir, "phrasey-locales-builder"),
    p.join(subpackagesDir, "phrasey-locales-shared"),
    p.join(subpackagesDir, "phrasey-toml"),
    p.join(subpackagesDir, "phrasey-xml"),
    p.join(subpackagesDir, "phrasey-yaml"),
];

const start = async () => {
    for (const packageDir of packageDirs) {
        const typedocPath = p.join(packageDir, "typedoc.json");
        const output = spawnSync("npx", ["typedoc", "--options", typedocPath], {
            cwd: packageDir,
            stdio: "inherit",
        });
        if (output.error) {
            return terminate(options.error);
        }
        if (output.status !== 0) {
            return terminate(
                `Process exited with ${output.status ?? "?"} exit code.`,
            );
        }
    }
};

start();

function terminate(error) {
    console.error(gray(logPrefix), error);
    process.exit(1);
}
