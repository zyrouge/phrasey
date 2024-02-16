const p = require("path");
const { PhraseyServer } = require("../dist");
const { PhraseyLogger } = require("phrasey");

const start = async () => {
    const exampleDir = p.resolve(__dirname, "../../../example");
    const exampleConfig = p.join(exampleDir, "config.yaml");

    await PhraseyServer.start({
        builder: {
            config: {
                file: exampleConfig,
                format: p.extname(exampleConfig).substring(1),
            },
        },
        phrasey: {
            cwd: exampleDir,
            log: PhraseyLogger.console(),
        },
    });
};

start();
