# Getting Started

## Installation

Can be installed from using [NPM](https://www.npmjs.com/package/phrasey) or [Yarn](https://yarnpkg.com/package/phrasey).

```bash
npm install --save-dev phrasey
yarn add --dev phrasey
```

Additionally, install the required [formats](../others/content-formats.md) for your project. Common formats including [JSON](https://npmjs.com/package/@zyrouge/phrasey-json), [YAML](https://npmjs.com/package/@zyrouge/phrasey-yaml), [TOML](https://npmjs.com/package/@zyrouge/phrasey-toml), [XML](https://npmjs.com/package/@zyrouge/phrasey-xml) can be installed using below commands.

```bash
npm install --save-dev @zyrouge/phrasey-json
npm install --save-dev @zyrouge/phrasey-yaml
npm install --save-dev @zyrouge/phrasey-toml
npm install --save-dev @zyrouge/phrasey-xml
# or preferably using yarn
```

Also, read about [translation string formats](../others/translation-string-formats.md).

## Setting up a project

Use the `init` command to create and initialize a new project.

```bash
npx phrasey init
```

This prompts a set of question which are used to create the [configuration](../project-structure/configuration.md) and [schema](../project-structure/schema.md) file.
