import { PhraseyError } from "./error";
import { PhraseyZSchemaKeyType } from "./z";
import { PhraseyTranslationStringParts } from "./translation";
import { PhraseySafeResolvePackage } from "./utils";

export interface PhraseyTranslationStringFormatter {
    format(
        parts: PhraseyTranslationStringParts,
        schema: PhraseyZSchemaKeyType
    ): any;
}

export class PhraseyTranslationStringFormats {
    static defaultFormats: Record<string, PhraseyTranslationStringFormatter> = {
        parts: {
            format: (parts) => parts,
        },
        "format-string": {
            format: (parts) => {
                let out = "";
                parts.forEach((x) => {
                    switch (x.type) {
                        case "string":
                            out += this.escapeCharacter(x.value, "{");
                            break;

                        case "parameter":
                            out += `{${x.value}}`;
                            break;
                    }
                });
                return out;
            },
        },
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

    static escapeCharacter(value: string, escapeChar: string) {
        let out = "";
        for (let i = 0; i < value.length; i++) {
            const char = value[i]!;
            if (char === escapeChar) {
                out += "\\";
            }
            out += char;
        }
        return out;
    }
}

export class PhraseyTranslationDefaultStringFormatters {}
