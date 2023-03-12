import { PhraseyConfigKeys } from "./config";
import { Phrasey, PhraseyTranslationSummary } from "./phrasey";

export class PhraseyCircuit<Keys extends PhraseyConfigKeys> {
    constructor(public client: Phrasey<Keys>) {}

    async build() {
        const startedAt = Date.now();
        await this.client.loadTranslations();
        await this.client.buildTranslationFiles(
            ({ translation, output, resolvedOutputPath }) => {
                this.log(
                    "info",
                    `Processed "${translation.locale}" (${output.path} -> ${resolvedOutputPath})`
                );
            }
        );
        const finishedAt = Date.now();
        this.log(
            "success",
            `Finished building ${
                this.client.translations.size
            } files successfully in ${finishedAt - startedAt}ms!`
        );
    }

    async createFullSummary() {
        await this.client.loadTranslations();
        const defaultTranslation = this.client.getDefaultTranslation();
        const fullSummary: Record<string, PhraseyTranslationSummary<Keys>> = {};
        for (const [, translation] of this.client.translations) {
            const summary = await this.client.getTranslationSummary(
                translation,
                defaultTranslation
            );
            fullSummary[translation.locale] = summary;
        }
    }

    log(prefix: "info" | "success", text: string) {
        const value = `[${prefix}] ${text}`;
        this.client.config.log?.(value) ?? console.log(value);
    }
}
