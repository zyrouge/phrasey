import { PhraseyConfig, PhraseyConfigKeys } from "./config";
import { Phrasey } from "./phrasey";

export class PhraseyCircuit<Keys extends PhraseyConfigKeys> {
    constructor(public client: Phrasey<Keys>) {}

    async build() {
        const startedAt = Date.now();
        await this.client.parseTranslations();
        await this.client.ensureTranslations();
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

    log(prefix: "info" | "success", text: string) {
        const value = `[${prefix}] ${text}`;
        this.client.config.log?.(value) ?? console.log(value);
    }

    static create<Keys extends PhraseyConfigKeys>(config: PhraseyConfig<Keys>) {
        const client = new Phrasey(config);
        return new PhraseyCircuit(client);
    }
}
