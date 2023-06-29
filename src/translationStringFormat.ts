import { PhraseyError } from "./error";
import { PhraseyZSchemaKeyType } from "./z";
import { PhraseyTranslationStringParts } from "./translation";
import { PhraseySafeResolvePackage } from "./utils";

export interface PhraseyTranslationStringFormatter<T = any> {
    format(
        parts: PhraseyTranslationStringParts,
        schema: PhraseyZSchemaKeyType
    ): T;
}

export class PhraseyTranslationStringFormats {
    static defaultFormats: Record<string, PhraseyTranslationStringFormatter> = {
        parts: this.construct<PhraseyTranslationStringParts>({
            format: (parts) => parts,
        }),
        "format-string": this.construct<string>({
            format: (parts, schema) => {
                const parameters = schema.parameters ?? [];
                let out = "";
                for (const x of parts) {
                    switch (x.type) {
                        case "parameter":
                            const index = parameters.indexOf(x.value);
                            out += `%${index}\$s`;
                            break;

                        case "string":
                            out += this.replaceCharacter(x.value, "%", "%%");
                            break;
                    }
                }
                return out;
            },
        }),
        "python-format-string": this.construct<string>({
            format: (parts) => {
                let out = "";
                parts.forEach((x) => {
                    switch (x.type) {
                        case "parameter":
                            out += `{${x.value}}`;
                            break;

                        case "string":
                            let escaped = this.replaceCharacters(x.value, {
                                "{": "{{",
                                "}": "}}",
                            });
                            escaped = this.replaceCharacter(escaped, "}", "}}");
                            out += escaped;
                            break;
                    }
                });
                return out;
            },
        }),
    };

    static resolve(name: string): PhraseyTranslationStringFormatter {
        const defaultFormat = this.defaultFormats[name];
        if (defaultFormat) {
            return defaultFormat;
        }
        const pkg = PhraseySafeResolvePackage(name);
        if (
            typeof pkg?.formatter === "object" &&
            typeof pkg.formatter.format === "function"
        ) {
            return pkg.formatter.format;
        }
        throw new PhraseyError(
            `Missing implementation of formatter in package "${name}"`
        );
    }

    static replaceCharacter(value: string, from: string, to: string) {
        let out = "";
        for (let i = 0; i < value.length; i++) {
            const char = value[i]!;
            if (char === from) {
                out += to;
            }
            out += char;
        }
        return out;
    }

    static replaceCharacters(value: string, replacers: Record<string, string>) {
        let out = "";
        for (let i = 0; i < value.length; i++) {
            const char = value[i]!;
            out += replacers[char] ?? char;
        }
        return out;
    }

    static construct<T>(formatter: PhraseyTranslationStringFormatter<T>) {
        return formatter;
    }
}
