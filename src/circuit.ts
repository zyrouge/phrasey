import { PhraseyConfig, PhraseyConfigKeys } from "./config";
import { Phrasey } from "./phrasey";

export class PhraseyCircuit<Keys extends PhraseyConfigKeys> {
    parsed = false;
    ensured = false;

    constructor(public client: Phrasey<Keys>) {}

    async ensureParsed() {
        if (this.parsed) return;
        await this.client.parseAllInputFiles();
        this.parsed = true;
    }

    async ensureEnsured() {
        if (this.ensured) return;
        this.client.ensureAllTranslations();
        this.ensured = true;
    }

    async build() {
        const startedAt = Date.now();
        await this.ensureParsed();
        await this.ensureEnsured();
        await this.client.buildOutputFiles(
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

    async getFullSummary() {
        await this.ensureParsed();
        const summary = await this.client.prepareFullSummary();
        return summary;
    }

    log(prefix: "info" | "success", text: string) {
        const value = `[${prefix}] ${text}`;
        this.client.config.log?.(value) ?? console.log(value);
    }

    static create<Keys extends PhraseyConfigKeys>(config: PhraseyConfig<Keys>) {
        const client = new Phrasey(config);
        return new PhraseyCircuit(client);
    }
}
