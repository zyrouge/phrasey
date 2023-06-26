import { PhraseyError } from "./error";
import { PhraseyContentFormatDeserializer } from "./contentFormats";
import { PhraseyLocaleType, PhraseyLocales } from "./locales";
import { PhraseyResult } from "./result";
import {
    PhraseySchemaKeyType,
    PhraseySchemaType,
    PhraseyUnprocessedTranslation,
} from "./schema";
import { PhraseyTransformer } from "./transformer";
import { PhraseyTranslationStringFormatter } from "./translationStringFormat";

export interface PhraseyTranslationStringPart {
    type: "string" | "parameter";
    value: string;
}

export type PhraseyTranslationStringParts = PhraseyTranslationStringPart[];

export interface PhraseyTranslationStringSet {
    state: "set" | "default";
    parts: PhraseyTranslationStringParts;
}

export interface PhraseyTranslationStringUnset {
    state: "unset";
}

export type PhraseyTranslationStringValue =
    | PhraseyTranslationStringSet
    | PhraseyTranslationStringUnset;

export interface PhraseyTranslationJson {
    locale: PhraseyLocaleType;
    extras: Record<string, any>;
    keys: Record<string, any>;
}

export class PhraseyTranslation {
    constructor(
        public path: string,
        public locale: PhraseyLocaleType,
        public extras: Record<string, any>,
        public keys: Record<string, PhraseyTranslationStringValue>,
        public stats: PhraseyTranslationStats
    ) {}

    json(
        stringFormatter: PhraseyTranslationStringFormatter
    ): PhraseyTranslationJson {
        const keys: Record<string, any> = {};
        Object.entries(this.keys).map(([k, v]) => {
            if (v.state === "set" || v.state === "default") {
                keys[k] = stringFormatter.format(v.parts);
            }
        });
        return { locale: this.locale, extras: this.extras, keys };
    }

    static async create(
        path: string,
        schema: PhraseySchemaType,
        deserialize: PhraseyContentFormatDeserializer,
        defaultTranslation?: PhraseyTranslation
    ): Promise<PhraseyResult<PhraseyTranslation, Error>> {
        const unprocessed = await PhraseyTransformer.transform(
            path,
            deserialize,
            PhraseyUnprocessedTranslation
        );
        if (!unprocessed.success) {
            return { success: false, error: unprocessed.error };
        }
        const locale = PhraseyLocales.find(
            (x) => x.code === unprocessed.data.locale
        );
        if (!locale) {
            return {
                success: false,
                error: new PhraseyError(
                    `Invalid locale "${unprocessed.data.locale}"`
                ),
            };
        }
        const stats = new PhraseyTranslationStats();
        const parsedKeys: Record<string, PhraseyTranslationStringValue> = {};
        for (const x of schema.keys) {
            const rawValue = unprocessed.data.keys[x.name];
            if (!rawValue) {
                const defaultKey = defaultTranslation?.keys[x.name];
                if (!defaultKey || defaultKey.state === "unset") {
                    stats.incrementUnset();
                    parsedKeys[x.name] = {
                        state: "unset",
                    };
                    continue;
                }
                parsedKeys[x.name] = {
                    state: "default",
                    parts: defaultKey.parts,
                };
                stats.incrementDefault();
                continue;
            }
            const parts = PhraseyTranslation.parseTranslationKeyValue(
                x,
                rawValue
            );
            if (!parts.success) return parts;
            parsedKeys[x.name] = {
                state: "set",
                parts: parts.data,
            };
            stats.incrementSet();
        }
        const translation = new PhraseyTranslation(
            path,
            locale,
            unprocessed.data.keys,
            parsedKeys,
            stats
        );
        return {
            success: true,
            data: translation,
        };
    }

    static parseTranslationKeyValue(
        key: PhraseySchemaKeyType,
        content: string
    ): PhraseyResult<PhraseyTranslationStringPart[], Error> {
        const parts: PhraseyTranslationStringPart[] = [];
        let escaped = false;
        let mode: PhraseyTranslationStringPart["type"] = "string";
        let current = "";
        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            if (char === "{" && !escaped) {
                if (mode === "parameter") {
                    return {
                        success: false,
                        error: new PhraseyError(
                            `Unexpected delimiter "{" at ${i}`
                        ),
                    };
                }
                if (current.length > 0) {
                    parts.push({
                        type: "string",
                        value: current,
                    });
                }
                current = "";
                mode = "parameter";
            } else if (char === "}" && mode === "parameter") {
                if (!key.parameters?.includes(current) ?? true) {
                    return {
                        success: false,
                        error: new PhraseyError(
                            `Invalid parameter "${current}" at ${
                                i - current.length - 1
                            }`
                        ),
                    };
                }
                parts.push({
                    type: "parameter",
                    value: current,
                });
                current = "";
                mode = "string";
            } else if (char === "\\") {
                escaped = true;
            } else {
                current += char;
            }
        }
        if (current.length > 0) {
            parts.push({
                type: "string",
                value: current,
            });
        }
        return { success: true, data: parts };
    }
}

export interface PhraseyTranslationStatsJson {
    set: number;
    defaulted: number;
    unset: number;
    total: number;
    setPercent: number;
    defaultedPercent: number;
    unsetPercent: number;
}

export class PhraseyTranslationStats {
    set = 0;
    defaulted = 0;
    unset = 0;
    total = 0;

    incrementSet() {
        this.set++;
        this.total++;
    }

    incrementDefault() {
        this.defaulted++;
        this.total++;
    }

    incrementUnset() {
        this.unset++;
        this.total++;
    }

    incrementWith(stats: PhraseyTranslationStats) {
        this.set += stats.set;
        this.defaulted += stats.defaulted;
        this.unset += stats.unset;
        this.total += stats.total;
    }

    json(): PhraseyTranslationStatsJson {
        return {
            set: this.set,
            defaulted: this.defaulted,
            unset: this.unset,
            total: this.total,
            setPercent: this.setPercent,
            defaultedPercent: this.defaultedPercent,
            unsetPercent: this.unsetPercent,
        };
    }

    get isBuildable() {
        return this.set + this.defaulted === this.total;
    }

    get isStandaloneBuildable() {
        return this.set === this.total;
    }

    get setPercent() {
        return (this.set / this.total) * 100;
    }

    get defaultedPercent() {
        return (this.defaulted / this.total) * 100;
    }

    get unsetPercent() {
        return (this.unset / this.total) * 100;
    }
}
