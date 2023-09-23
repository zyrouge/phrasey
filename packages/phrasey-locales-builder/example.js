const { PhraseyLocaleBuilder } = require("./dist");

const start = async () => {
    const codes = await PhraseyLocaleBuilder.build({
        displayLocaleCode: "en",
    });
    console.log(JSON.stringify(codes, null, 4));
};

start();
