// /**
//  * @type {import("eslint").ESLint.ConfigData}
//  */
// module.exports = {
//     env: {
//         commonjs: true,
//         es2021: true,
//         node: true,
//     },
//     extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
//     overrides: [
//         {
//             env: {
//                 node: true,
//             },
//             files: [".eslintrc.{js,cjs}"],
//             parserOptions: {
//                 sourceType: "script",
//             },
//         },
//     ],
//     parser: "@typescript-eslint/parser",
//     parserOptions: {
//         ecmaVersion: "latest",
//         tsconfigRootDir: __dirname,
//         project: [
//             `${__dirname}/tsconfig.base.json`,
//             `${__dirname}/tsconfig.eslint.json`,
//             "packages/*/tsconfig.json",
//         ],
//     },
//     plugins: ["@typescript-eslint"],
//     rules: {
// "linebreak-style": ["error", "unix"],
// quotes: ["error", "double", { avoidEscape: true }],
// semi: ["error", "always"],
//     },
//     ignorePatterns: ["dist", "docs-dist", "example", "scripts"],
//     root: true,
// };

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
