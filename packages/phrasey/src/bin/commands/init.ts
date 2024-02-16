import { Command } from "commander";
import { writeFile, exists, ensureDir } from "fs-extra";
import p from "path";
import {
    PhraseyZConfigType,
    PhraseyZSchemaType,
    PhraseyZTranslationType,
} from "../..";
import { log } from "../utils/log";

export const InitCommand = new Command()
    .name("init")
    .description("Initialize a new project. (deprecated)")
    .action(async () => {
        const config: PhraseyZConfigType = {
            input: {
                files: ["./i18n/**.json"],
                format: "json",
                fallback: [],
            },
            schema: {
                file: "./phrasey-schema.json",
                format: "json",
            },
            output: {
                dir: "./dist-i18n",
                format: "json",
                stringFormat: "format-string",
            },
            hooks: {
                files: [],
            },
        };
        const configFilePath = p.resolve(process.cwd(), "./phrasey.json");
        await writeJsonFile(configFilePath, config);
        log.success(`Generated config at "${configFilePath}".`);
        const schema: PhraseyZSchemaType = {
            keys: [
                {
                    name: "HelloX",
                    description: "Say hello to a user!",
                    parameters: ["user"],
                },
            ],
        };
        const schemaFilePath = p.resolve(
            process.cwd(),
            "./phrasey-schema.json",
        );
        await writeJsonFile(schemaFilePath, schema);
        log.success(`Generated schema at "${schemaFilePath}".`);
        const demoTranslation: PhraseyZTranslationType = {
            locale: "en",
            keys: {
                HelloX: "Hello {user}!",
            },
        };
        const demoTranslationFilePath = p.resolve(
            process.cwd(),
            "./i18n/en.json",
        );
        await ensureDir(p.dirname(demoTranslationFilePath));
        await writeJsonFile(demoTranslationFilePath, demoTranslation);
        log.success(
            `Generated demo translation at "${demoTranslationFilePath}".`,
        );
    });

async function writeJsonFile(path: string, json: unknown) {
    const stringified = JSON.stringify(json, null, 4);
    if (await exists(path)) {
        log.error(`Existing config file at "${path}", exiting...`);
        log.ln();
        process.exit(1);
    }
    await writeFile(path, stringified);
}
