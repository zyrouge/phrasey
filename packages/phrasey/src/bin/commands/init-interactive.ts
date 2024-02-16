import { Command } from "commander";
import enquirer, { Prompt } from "enquirer";
import { writeFile } from "fs-extra";
import p from "path";
import {
    PhraseyZConfigType,
    PhraseyZSchemaType,
    PhraseyZTranslationType,
    PhraseyContentFormats,
    PhraseyTranslationStringFormats,
    PhraseySafeRun,
} from "../..";
import { log, pico } from "../utils/log";

interface InitInteractiveOptions {
    configFile: string;
    configFormat: string;
    inputFiles: string;
    inputFormat: string;
    schemaFile: string;
    schemaFormat: string;
    outputDir: string;
    outputFormat: string;
    outputStringFormat: string;
}

type InitInteractiveCommandOptions = Partial<
    InitInteractiveOptions & {
        yes: boolean;
    }
>;

export const InitInteractiveCommand = new Command()
    .name("init-interactive")
    .description("Initialize a new project. (deprecated)")
    .option("--config-file <value>", "Path to config file.")
    .option("--config-format <value>", "Format of config file.")
    .option("--input-files <value>", "Path to input files.")
    .option("--input-format <value>", "Format of input files.")
    .option("--schema-file <value>", "Path to schema file.")
    .option("--schema-format <value>", "Format of schema file.")
    .option("--output-dir <value>", "Path of output folder.")
    .option("--output-format <value>", "Format of output file.")
    .option("--output-string-format <value>", "Format of output strings.")
    .option("--y, --yes", "Yes to all.")
    .action(async (options: InitInteractiveCommandOptions) => {
        log.write(pico.bold(`Thank you for choosing ${pico.cyan("Phrasey")}!`));
        log.write(
            "Please answer the below question to initialize the project.",
        );
        log.ln();
        options.configFile ??= await inquire<string>({
            type: "input",
            message: "Path to config file (eg. ./phrasey.json)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid path or glob",
            ),
        });
        options.configFormat ??= await inquire<string>({
            type: "input",
            message: "Format of config file (eg. json)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid format",
            ),
        });
        const configFormatCheck = isContentFormatInstalled(
            options.configFormat,
        );
        if (!configFormatCheck.isInstalled) {
            log.ln();
            logUnableToResolveFormat(configFormatCheck);
            log.ln();
            process.exit(1);
        }
        options.inputFiles ??= await inquire<string>({
            type: "input",
            message: "Path to input files (supports glob) (eg. ./i18n/**.json)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid path or glob",
            ),
        });
        options.inputFormat ??= await inquire<string>({
            type: "input",
            message: "Format of input files (eg. json)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid format",
            ),
        });
        const inputFormatCheck = isContentFormatInstalled(options.inputFormat);
        if (!inputFormatCheck.isInstalled) {
            log.ln();
            logUnableToResolveFormat(inputFormatCheck);
            log.ln();
            process.exit(1);
        }
        options.schemaFile ??= await inquire<string>({
            type: "input",
            message: "Path to schema file (eg. ./phrasey-schema.json)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid path",
            ),
        });
        options.schemaFormat ??= await inquire<string>({
            type: "input",
            message: "Format of schema file (eg. json)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid format",
            ),
        });
        const schemaFormatCheck = isContentFormatInstalled(
            options.schemaFormat,
        );
        if (!schemaFormatCheck.isInstalled) {
            log.ln();
            logUnableToResolveFormat(schemaFormatCheck);
            log.ln();
            process.exit(1);
        }
        options.outputDir ??= await inquire<string>({
            type: "input",
            message: "Path to output directory (eg. ./dist-i18n)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid path",
            ),
        });
        options.outputFormat ??= await inquire<string>({
            type: "input",
            message: "Format of output files (eg. json)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid format",
            ),
        });
        const outputFormatCheck = isContentFormatInstalled(
            options.outputFormat,
        );
        if (!outputFormatCheck.isInstalled) {
            log.ln();
            logUnableToResolveFormat(outputFormatCheck);
            log.ln();
            process.exit(1);
        }
        options.outputStringFormat ??= await inquire<string>({
            type: "input",
            message:
                "Format of translation strings in output files (eg. format-string)",
            validate: inquirerNonEmptyStringValidate(
                "Please enter a valid format",
            ),
        });
        const outputStringFormatCheck = isTranslationStringFormatInstalled(
            options.outputStringFormat,
        );
        if (!outputStringFormatCheck.isInstalled) {
            log.ln();
            logUnableToResolveFormat(outputStringFormatCheck);
            log.ln();
            process.exit(1);
        }
        options.yes ??= await inquire<boolean>({
            type: "confirm",
            message: "Proceed?",
            initial: false,
        });
        if (!options.yes) {
            log.ln();
            log.warn("Exiting...");
            log.ln();
            process.exit(1);
        }
        log.ln();
        const {
            configFile,
            configFormat,
            inputFiles,
            inputFormat,
            schemaFile,
            schemaFormat,
            outputDir,
            outputFormat,
            outputStringFormat,
        } = options as InitInteractiveOptions;
        const config: PhraseyZConfigType = {
            input: {
                files: [inputFiles],
                format: inputFormat,
                fallback: [],
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
            hooks: {
                files: [],
            },
        };
        const configFormatter = PhraseySafeRun(() =>
            PhraseyContentFormats.resolve(configFormat),
        );
        if (configFormatter.success) {
            const configFilePath = p.resolve(process.cwd(), configFile);
            await writeFile(
                configFilePath,
                configFormatter.data.serialize(config),
            );
            log.success(`Generated config at "${configFilePath}".`);
        } else {
            log.error(
                `Unable to use specified config format "${configFormat}" due to errors.`,
            );
            log.logErrors(configFormatter.error);
            log.ln();
            log.info(
                `You could try manually creating "${configFile}" using the below generated config.`,
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
            PhraseyContentFormats.resolve(schemaFormat),
        );
        if (schemaFormatter.success) {
            const schemaFilePath = p.resolve(process.cwd(), schemaFile);
            await writeFile(
                schemaFilePath,
                schemaFormatter.data.serialize(schema),
            );
            log.success(`Generated schema at "${schemaFilePath}".`);
        } else {
            log.error(
                `Unable to use specified schema format "${configFormat}" due to errors.`,
            );
            log.logErrors(schemaFormatter.error);
            log.ln();
            log.info(
                `You could try manually creating "${schemaFile}" using the below generated schema.`,
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
            PhraseyContentFormats.resolve(inputFormat),
        );
        if (inputFormatter.success) {
            const serializedDemoTranslation =
                inputFormatter.data.serialize(demoTranslation);
            log.info(
                "Get started by creating a translation file that matches the generated content!",
            );
            log.info("Example of translation file:");
            log.write(serializedDemoTranslation.trim());
            log.ln();
        } else {
            log.error(
                `Unable to use specified input translation format "${inputFormat}" due to errors.`,
            );
            log.logErrors(inputFormatter.error);
            log.ln();
            log.info(
                "You could try manually creating a translation file using the below generated content.",
            );
            log.write(JSON.stringify(demoTranslation, null, 4));
            log.ln();
        }
    });

function logUnableToResolveFormat(result: IsFormatInstalledFailResult) {
    log.error(`Unable to resolve format "${result.format}".`);
    log.logErrors(result.error);
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
    const packageName = PhraseyContentFormats.defaultPackages[format] ?? format;
    try {
        PhraseyContentFormats.resolve(packageName);
        return { format, isInstalled: true, packageName };
    } catch (error) {
        return { format, isInstalled: false, packageName, error };
    }
}

function isTranslationStringFormatInstalled(
    format: string,
): IsFormatInstalledResult {
    const packageName = format;
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
    error: string,
): InquireOptions["validate"] {
    return (input) => {
        if (typeof input === "string" && input.length > 0) {
            return true;
        }
        return error;
    };
}
