import path from "path";
import fs from "fs-extra";
import yaml from "yaml";
import FastGlob from "fast-glob";
import { PhraseyConfig, PhraseyConfigKeys } from "./config";
import { PhraseyUtils } from "./utils";
import { PhraseyError } from "./error";

export interface PhraseyOptions<Keys extends PhraseyConfigKeys> {
    config: PhraseyConfig<Keys>;
}

export interface PhraseyTranslation<Keys extends PhraseyConfigKeys> {
    path: string;
    locale: string;
    language: string;
    translations: Record<Keys[number], string>;
}

export class Phrasey<Keys extends PhraseyConfigKeys> {
    translations = new Map<string, PhraseyTranslation<Keys>>();

    constructor(public options: PhraseyOptions<Keys>) {}

    async parseTranslationFile(p: string) {
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

    ensureTranslationKeys(
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

    async processTranslations() {
        const defaultTranslation = this.getDefaultTranslation();
        if (defaultTranslation) {
            this.ensureTranslationKeys(defaultTranslation);
        }
        for (const [, x] of this.translations) {
            if (x.locale === defaultTranslation?.locale) {
                continue;
            }
            this.ensureTranslationKeys(x, defaultTranslation);
        }
    }

    async buildTranslationFiles() {
        for (const [, x] of this.translations) {
            const output = await this.config.transpile.output(x);
            let resolvedPath = path.resolve(
                this.config.rootDir ?? process.cwd(),
                output.path
            );
            await fs.ensureDir(path.dirname(resolvedPath));
            await fs.writeFile(resolvedPath, output.content);
            this.log(
                "success",
                `Processed "${x.locale}" (${x.path} -> ${resolvedPath})`
            );
        }
    }

    async build() {
        const startedAt = Date.now();
        const { rootDir, input } = this.config;
        const files = FastGlob.stream(input.include, {
            absolute: true,
            cwd: rootDir,
            ignore: input.exclude,
        });
        for await (const x of files) {
            await this.parseTranslationFile(x.toString());
        }
        await this.processTranslations();
        await this.config.transpile.beforeOutput?.();
        await this.buildTranslationFiles();
        const finishedAt = Date.now();
        this.log(
            "success",
            `Finished building ${
                this.translations.size
            } files successfully in ${finishedAt - startedAt}ms!`
        );
    }

    log(prefix: "success", text: string) {
        const value = `[${prefix}] ${text}`;
        this.config.log?.(value) ?? console.log(value);
    }

    get config() {
        return this.options.config;
    }
}
