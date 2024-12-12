const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
    {
        ignores: ["packages/*/dist/**/*"],
    },
    {
        files: ["packages/*/src/**/*.ts"],
        extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
        rules: {
            indent: [
                "error",
                4,
                {
                    SwitchCase: 1,
                },
            ],
            quotes: ["error", "double", { avoidEscape: true }],
            semi: ["error", "always"],
        },
    },
);
