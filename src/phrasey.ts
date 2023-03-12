import path from "path";
import fs from "fs-extra";
import yaml from "yaml";
import FastGlob from "fast-glob";
import {
    PhraseyConfig,
    PhraseyConfigKeys,
    PhraseyTranspileOutputResult,
} from "./config";
import { PhraseyUtils } from "./utils";
import { PhraseyError } from "./error";

export interface PhraseyTranslation<Keys extends PhraseyConfigKeys> {
    path: string;
    locale: string;
    language: string;
    translations: Record<Keys[number], string>;
}

export type PhraseyTranslationSummaryTranslationState =
    | "set"
    | "default"
    | "unset";

export interface PhraseyTranslationSummary<Keys extends PhraseyConfigKeys> {
    translation: PhraseyTranslation<Keys>;
    isBuildable: boolean;
    isStandaloneBuildable: boolean;
    keys: {
        states: Record<Keys[number], PhraseyTranslationSummaryTranslationState>;
        set: number;
        defaulted: number;
        unset: number;
        total: number;
    };
}

export interface PhraseyFullSummary<Keys extends PhraseyConfigKeys> {
    keys: {
        set: number;
        defaulted: number;
        unset: number;
        total: number;
        percents: {
            set: number;
            defaulted: number;
            setOrDefaulted: number;
            unset: number;
        };
    };
    summary: Record<string, PhraseyTranslationSummary<Keys>>;
}

export class Phrasey<Keys extends PhraseyConfigKeys> {
    translations = new Map<string, PhraseyTranslation<Keys>>();

    constructor(public config: PhraseyConfig<Keys>) {}

    async parseInputFile(p: string) {
        const { transpile } = this.config;
        const content = await fs.readFile(p);
        let parsed = yaml.parse(content.toString());
        if (transpile.beforeTranspilingFile) {
            parsed = await transpile.beforeTranspilingFile(parsed);
        }
        if (!PhraseyUtils.isNotBlankString(parsed.Locale)) {
            throw new PhraseyError(`Invalid "Locale" in "${p}"`);
        }
        if (!PhraseyUtils.isNotBlankString(parsed.Language)) {
            throw new PhraseyError(`Invalid "Language" in "${p}"`);
        }
        if (!PhraseyUtils.isObject(parsed.Translations)) {
            throw new PhraseyError(`Invalid "Translations" in "${p}"`);
        }
        let translation: PhraseyTranslation<Keys> = {
            path: p,
            locale: parsed.Locale,
            language: parsed.Language,
            translations: parsed.Translations,
        };
        if (transpile.afterTranspilingFile) {
            translation = await transpile.afterTranspilingFile(translation);
        }
        if (this.translations.has(translation.locale)) {
            const existing = this.translations.get(translation.locale)!;
            throw new PhraseyError(
                `Duplicate locales found in "${translation.path}" and "${existing.path}" (${existing.locale})`
            );
        }
        this.translations.set(translation.locale, translation);
    }

    getDefaultTranslation() {
        if (!this.config.defaultLocale) return;
        if (!this.translations.has(this.config.defaultLocale)) {
            throw new PhraseyError(
                `Invalid default locale "${this.config.defaultLocale}"`
            );
        }
        return this.translations.get(this.config.defaultLocale);
    }

    ensureTranslation(
        translation: PhraseyTranslation<Keys>,
        defaultTranslation?: PhraseyTranslation<Keys>
    ) {
        for (const x of this.config.keys) {
            const key = x as Keys[number];
            if (defaultTranslation) {
                translation.translations[key] =
                    defaultTranslation.translations[key];
            }
            if (!PhraseyUtils.isNotBlankString(translation.translations[key])) {
                throw new PhraseyError(
                    `Missing translation key "${key}" in "${translation.locale}" (${translation.path})`
                );
            }
        }
    }

    ensureAllTranslations() {
        const defaultTranslation = this.getDefaultTranslation();
        if (defaultTranslation) {
            this.ensureTranslation(defaultTranslation);
        }
        for (const [, x] of this.translations) {
            if (x.locale === defaultTranslation?.locale) {
                continue;
            }
            this.ensureTranslation(x, defaultTranslation);
        }
    }

    async buildOutputFiles(
        onBuild?: (data: {
            translation: PhraseyTranslation<Keys>;
            output: PhraseyTranspileOutputResult;
            resolvedOutputPath: string;
        }) => void
    ) {
        await this.config.transpile.beforeOutput?.();
        for (const [, x] of this.translations) {
            const output = await this.config.transpile.output(x);
            let resolvedPath = path.resolve(
                this.config.rootDir ?? process.cwd(),
                output.path
            );
            await fs.ensureDir(path.dirname(resolvedPath));
            await fs.writeFile(resolvedPath, output.content);
            onBuild?.({
                translation: x,
                output: output,
                resolvedOutputPath: resolvedPath,
            });
        }
    }

    async getInputFiles() {
        const { rootDir, input } = this.config;
        const files = FastGlob.stream(input.include, {
            absolute: true,
            cwd: rootDir,
            ignore: input.exclude,
        });
        return files;
    }

    async parseAllInputFiles() {
        const files = await this.getInputFiles();
        for await (const x of files) {
            await this.parseInputFile(x.toString());
        }
    }

    async prepareSummary(
        translation: PhraseyTranslation<Keys>,
        defaultTranslation?: PhraseyTranslation<Keys>
    ) {
        const summary: PhraseyTranslationSummary<Keys> = {
            translation,
            isBuildable: false,
            isStandaloneBuildable: false,
            keys: {
                states: {} as Record<
                    Keys[number],
                    PhraseyTranslationSummaryTranslationState
                >,
                set: 0,
                defaulted: 0,
                unset: 0,
                total: 0,
            },
        };
        for (const x of this.config.keys) {
            const key = x as Keys[number];
            if (PhraseyUtils.isNotBlankString(translation.translations[key])) {
                summary.keys.states[key] = "set";
                summary.keys.set++;
            } else if (
                PhraseyUtils.isNotBlankString(
                    defaultTranslation?.translations[key]
                )
            ) {
                summary.keys.states[key] = "default";
                summary.keys.defaulted++;
            } else {
                summary.keys.states[key] = "unset";
                summary.keys.unset++;
            }
            summary.keys.total++;
        }
        summary.isBuildable =
            summary.keys.set + summary.keys.defaulted === summary.keys.total;
        summary.isStandaloneBuildable = summary.keys.set === summary.keys.total;
        return summary;
    }

    async prepareFullSummary() {
        const defaultTranslation = this.getDefaultTranslation();
        const fullSummary: PhraseyFullSummary<Keys> = {
            keys: {
                set: 0,
                defaulted: 0,
                unset: 0,
                total: 0,
                percents: {
                    set: 0,
                    defaulted: 0,
                    setOrDefaulted: 0,
                    unset: 0,
                },
            },
            summary: {},
        };
        for (const [, translation] of this.translations) {
            const summary = await this.prepareSummary(
                translation,
                defaultTranslation
            );
            fullSummary.keys.set += summary.keys.set;
            fullSummary.keys.defaulted += summary.keys.defaulted;
            fullSummary.keys.unset += summary.keys.unset;
            fullSummary.keys.total += summary.keys.total;
            fullSummary.summary[translation.locale] = summary;
        }
        fullSummary.keys.percents.set = PhraseyUtils.calculatePercentage(
            fullSummary.keys.set,
            fullSummary.keys.total
        );
        fullSummary.keys.percents.defaulted = PhraseyUtils.calculatePercentage(
            fullSummary.keys.defaulted,
            fullSummary.keys.total
        );
        fullSummary.keys.percents.setOrDefaulted =
            PhraseyUtils.calculatePercentage(
                fullSummary.keys.set + fullSummary.keys.defaulted,
                fullSummary.keys.total
            );
        fullSummary.keys.percents.unset = PhraseyUtils.calculatePercentage(
            fullSummary.keys.unset,
            fullSummary.keys.total
        );
        return fullSummary;
    }
}
