import { PhraseyError } from "./errors";
import { PhraseyTranslationStringParts } from "./translation";
import { PhraseySafeResolvePackage } from "./utils";
import { PhraseyZSchemaKeyType } from "./z";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PhraseyTranslationStringFormatter<T = any> {
    format(
        parts: PhraseyTranslationStringParts,
        schema: PhraseyZSchemaKeyType,
    ): T;
}

export class PhraseyTranslationStringFormats {
    static defaultFormats: Record<string, PhraseyTranslationStringFormatter> = {
        parts: this.construct<PhraseyTranslationStringParts>({
            format: (parts) => parts,
        }),
        /**
         *  0 - String, 1 - Parameter
         */
        "compact-parts": this.construct<[0 | 1, string][]>({
            format: (parts) => {
                return parts.map((x) => {
                    switch (x.type) {
                        case "string":
                            return [0, x.value];

                        case "parameter":
                            return [1, x.value];
                    }
                });
            },
        }),
        "format-string": this.construct<string>({
            format: (parts, schema) => {
                const parameters = schema.parameters ?? [];
                let out = "";
                for (const x of parts) {
                    switch (x.type) {
                        case "parameter":
                            out += `%${parameters.indexOf(x.value)}$s`;
                            break;

                        case "string":
                            out += this.replaceCharacter(x.value, "%", "%%");
                            break;
                    }
                }
                return out;
            },
        }),
        "java-format-string": this.construct<string>({
            format: (parts, schema) => {
                const parameters = schema.parameters ?? [];
                let out = "";
                for (const x of parts) {
                    switch (x.type) {
                        case "parameter":
                            out += `%${parameters.indexOf(x.value) + 1}$s`;
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
                            // eslint-disable-next-line no-case-declarations
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
        "python-positional-format-string": this.construct<string>({
            format: (parts, schema) => {
                const parameters = schema.parameters ?? [];
                let out = "";
                parts.forEach((x) => {
                    switch (x.type) {
                        case "parameter":
                            out += `{${parameters.indexOf(x.value)}}`;
                            break;

                        case "string":
                            // eslint-disable-next-line no-case-declarations
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
        if (typeof pkg?.stringFormatter !== "object") {
            throw new PhraseyError(
                `Missing implementation of "stringFormatter" in package "${name}"`,
            );
        }
        if (typeof pkg.stringFormatter.format !== "function") {
            throw new PhraseyError(
                `Missing implementation of "stringFormatter.format" in package "${name}"`,
            );
        }
        return pkg.stringFormatter;
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
