import p from "path";
import { Command } from "commander";
import enquirer, { Prompt } from "enquirer";
import {
    PhraseyZConfigType,
    PhraseyZSchemaType,
    PhraseyZTranslationType,
    PhraseyContentFormats,
    PhraseyTranslationStringFormats,
    PhraseyTreeLike,
    PhraseySafeRun,
} from "../..";
import { log, pico } from "../utils";
import { writeFile } from "fs-extra";

export const InitCommand = new Command()
    .name("init")
    .description("Initialize a new project.")
    .action(async () => {
        log.write(pico.bold(`Thank you for choosing ${pico.cyan("Phrasey")}!`));
        log.write(
            `Please answer the below question to initialize the project.`
        );
        log.ln();
        const configFile = await inquire<string>({
            type: "input",
            message: "Path to config file (eg. ./phrasey.json)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid path or glob"
            ),
        });
        const configFormat = await inquire<string>({
            type: "input",
            message: "Format of config file (eg. json)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid format"
            ),
        });
        const configFormatCheck = isContentFormatInstalled(configFormat);
        if (!configFormatCheck.isInstalled) {
            log.ln();
            logUnableToResolveFormat(configFormatCheck);
            log.ln();
            process.exit(1);
        }
        const inputFiles = await inquire<string>({
            type: "input",
            message: "Path to input files (supports glob) (eg. ./i18n/**.json)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid path or glob"
            ),
        });
        const inputFormat = await inquire<string>({
            type: "input",
            message: "Format of input files (eg. json)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid format"
            ),
        });
        const inputFormatCheck = isContentFormatInstalled(inputFormat);
        if (!inputFormatCheck.isInstalled) {
            log.ln();
            logUnableToResolveFormat(inputFormatCheck);
            log.ln();
            process.exit(1);
        }
        const fallbackInputFile = await inquire<string | undefined>({
            type: "input",
            message: "Path to fallback input file (eg. ./i18n/en.json)",
        });
        const schemaFile = await inquire<string>({
            type: "input",
            message: "Path to schema file (eg. ./phrasey-schema.json)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid path"
            ),
        });
        const schemaFormat = await inquire<string>({
            type: "input",
            message: "Format of schema file (eg. json)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid format"
            ),
        });
        const schemaFormatCheck = isContentFormatInstalled(schemaFormat);
        if (!schemaFormatCheck.isInstalled) {
            log.ln();
            logUnableToResolveFormat(schemaFormatCheck);
            log.ln();
            process.exit(1);
        }
        const outputDir = await inquire<string>({
            type: "input",
            message: "Path to output directory (eg. ./dist-i18n)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid path"
            ),
        });
        const outputFormat = await inquire<string>({
            type: "input",
            message: "Format of output files (eg. json)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid format"
            ),
        });
        const outputFormatCheck = isContentFormatInstalled(outputFormat);
        if (!outputFormatCheck.isInstalled) {
            log.ln();
            logUnableToResolveFormat(outputFormatCheck);
            log.ln();
            process.exit(1);
        }
        const outputStringFormat = await inquire<string>({
            type: "input",
            message:
                "Format of translation strings in output files (eg. format-string)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid format"
            ),
        });
        const outputStringFormatCheck =
            isTranslationStringFormatInstalled(outputStringFormat);
        if (!outputStringFormatCheck.isInstalled) {
            log.ln();
            logUnableToResolveFormat(outputStringFormatCheck);
            log.ln();
            process.exit(1);
        }
        const hooksFile = await inquire<string | undefined>({
            type: "input",
            message: "Path to hooks file (eg. ./i18n-hooks.js)",
        });
        log.ln();
        const config: PhraseyZConfigType = {
            input: {
                files: [inputFiles],
                format: inputFormat,
                fallback: fallbackInputFile,
            },
            schema: {
                file: schemaFile,
                format: schemaFormat,
            },
            output: {
                dir: outputDir,
                format: outputFormat,
                stringFormat: outputStringFormat,
            },
            hooks: hooksFile ? { files: [hooksFile] } : undefined,
        };
        const configFormatter = PhraseySafeRun(() =>
            PhraseyContentFormats.resolve(configFormat)
        );
        if (configFormatter.success) {
            const configFilePath = p.resolve(process.cwd(), configFile);
            await writeFile(
                configFilePath,
                configFormatter.data.serialize(config)
            );
            log.success(`Generated config at "${configFilePath}".`);
        } else {
            log.error(
                `Unable to use specified config format "${configFormat}" due to errors.`
            );
            log.grayed(PhraseyTreeLike.build([configFormatter.error]));
            log.ln();
            log.info(
                `You could try manually creating "${configFile}" using the below generated config.`
            );
            log.write(JSON.stringify(config, null, 4));
            log.ln();
        }
        const schema: PhraseyZSchemaType = {
            keys: [
                {
                    name: "HelloX",
                    description: "Say hello to a user!",
                    parameters: ["user"],
                },
            ],
        };
        const schemaFormatter = PhraseySafeRun(() =>
            PhraseyContentFormats.resolve(schemaFormat)
        );
        if (schemaFormatter.success) {
            const schemaFilePath = p.resolve(process.cwd(), schemaFile);
            await writeFile(
                schemaFilePath,
                schemaFormatter.data.serialize(schema)
            );
            log.success(`Generated schema at "${schemaFilePath}".`);
        } else {
            log.error(
                `Unable to use specified schema format "${configFormat}" due to errors.`
            );
            log.grayed(PhraseyTreeLike.build([schemaFormatter.error]));
            log.ln();
            log.info(
                `You could try manually creating "${schemaFile}" using the below generated schema.`
            );
            log.write(JSON.stringify(schema, null, 4));
            log.ln();
        }
        const demoTranslation: PhraseyZTranslationType = {
            locale: "en",
            keys: {
                HelloX: "Hello {user}!",
            },
        };
        const inputFormatter = PhraseySafeRun(() =>
            PhraseyContentFormats.resolve(inputFormat)
        );
        if (inputFormatter.success) {
            const serializedDemoTranslation =
                inputFormatter.data.serialize(demoTranslation);
            if (fallbackInputFile) {
                const fallbackInputFilePath = p.resolve(
                    process.cwd(),
                    fallbackInputFile
                );
                await writeFile(
                    fallbackInputFilePath,
                    serializedDemoTranslation
                );
                log.success(
                    `Generated fallback translation file at "${fallbackInputFilePath}".`
                );
            } else {
                log.info(
                    `Get started by creating a translation file that matches the generated content!`
                );
                log.ln();
                log.info(`Example of translation file:`);
                log.write(serializedDemoTranslation);
                log.ln();
            }
        } else {
            log.error(
                `Unable to use specified input translation format "${inputFormat}" due to errors.`
            );
            log.grayed(PhraseyTreeLike.build([inputFormatter.error]));
            log.ln();
            log.info(
                `You could try manually creating a translation file using the below generated content.`
            );
            log.write(JSON.stringify(demoTranslation, null, 4));
            log.ln();
        }
    });

function logUnableToResolveFormat(result: IsFormatInstalledFailResult) {
    log.error(`Unable to resolve format "${result.format}".`);
    log.grayed(PhraseyTreeLike.build([result.error]));
}

interface IsFormatInstalledSuccessResult {
    format: string;
    isInstalled: true;
    packageName: string;
}

interface IsFormatInstalledFailResult {
    format: string;
    isInstalled: false;
    packageName: string;
    error: unknown;
}

type IsFormatInstalledResult =
    | IsFormatInstalledSuccessResult
    | IsFormatInstalledFailResult;

function isContentFormatInstalled(format: string): IsFormatInstalledResult {
    let packageName = PhraseyContentFormats.defaultPackages[format] ?? format;
    try {
        PhraseyContentFormats.resolve(packageName);
        return { format, isInstalled: true, packageName };
    } catch (error) {
        return { format, isInstalled: false, packageName, error };
    }
}

function isTranslationStringFormatInstalled(
    format: string
): IsFormatInstalledResult {
    let packageName = format;
    try {
        return {
            format,
            isInstalled:
                !!PhraseyTranslationStringFormats.defaultFormats[format] ||
                !!PhraseyTranslationStringFormats.resolve(packageName),
            packageName,
        };
    } catch (error) {
        return { format, isInstalled: false, packageName, error };
    }
}

interface InquireAnswers<T> {
    question: T;
}

type InquireOptions = NonNullable<ConstructorParameters<typeof Prompt>[0]>;

async function inquire<T>(options: Omit<InquireOptions, "name">) {
    const { question } = await enquirer.prompt<InquireAnswers<T>>({
        name: "question",
        ...options,
    });
    return question;
}

function inquirerNonEmptyStringValidate(
    error: string
): InquireOptions["validate"] {
    return (input) => {
        if (typeof input === "string" && input.length > 0) {
            return true;
        }
        return error;
    };
}
