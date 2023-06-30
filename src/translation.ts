import { PhraseyError, PhraseyWrappedError } from "./error";
import { PhraseyContentFormatter } from "./contentFormats";
import { PhraseyLocaleType, PhraseyLocales } from "./locales";
import { PhraseyResult } from "./result";
import { PhraseyTransformer } from "./transformer";
import { PhraseyTranslationStringFormatter } from "./translationStringFormat";
import { PhraseySchema } from "./schema";
import { PhraseyZSchemaKeyType, PhraseyZTranslation } from "./z";

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
        public schema: PhraseySchema,
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
                const keySchema = this.schema.key(k);
                try {
                    keys[k] = stringFormatter.format(v.parts, keySchema);
                } catch (err) {
                    throw new PhraseyWrappedError(
                        "Formatting translation string failed",
                        err
                    );
                }
            }
        });
        return { locale: this.locale, extras: this.extras, keys };
    }

    static async create(
        path: string,
        schema: PhraseySchema,
        formatter: PhraseyContentFormatter,
        defaultTranslation?: PhraseyTranslation
    ): Promise<PhraseyResult<PhraseyTranslation, Error>> {
        const unprocessed = await PhraseyTransformer.transform(
            path,
            formatter,
            PhraseyZTranslation
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
        const extras = unprocessed.data.extras ?? {};
        const stats = new PhraseyTranslationStats();
        const parsedKeys: Record<string, PhraseyTranslationStringValue> = {};
        for (const x of schema.z.keys) {
            const rawValue = unprocessed.data.keys[x.name];
            if (!rawValue) {
                const defaultKey = defaultTranslation?.keys[x.name];
                if (!defaultKey || defaultKey.state === "unset") {
                    stats.addUnset(x.name);
                    parsedKeys[x.name] = {
                        state: "unset",
                    };
                    continue;
                }
                parsedKeys[x.name] = {
                    state: "default",
                    parts: defaultKey.parts,
                };
                stats.addDefaulted(x.name);
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
            stats.addSet(x.name);
        }
        const translation = new PhraseyTranslation(
            path,
            schema,
            locale,
            extras,
            parsedKeys,
            stats
        );
        return {
            success: true,
            data: translation,
        };
    }

    static parseTranslationKeyValue(
        key: PhraseyZSchemaKeyType,
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
                if (!(key.parameters?.includes(current) ?? false)) {
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

export interface PhraseyTranslationStatsJsonExtendedState {
    keys: string[];
    count: number;
    percent: number;
}

export interface PhraseyTranslationStatsJson {
    set: PhraseyTranslationStatsJsonExtendedState;
    defaulted: PhraseyTranslationStatsJsonExtendedState;
    unset: PhraseyTranslationStatsJsonExtendedState;
    total: number;
    isBuildable: boolean;
    isStandaloneBuildable: boolean;
}

export class PhraseyTranslationStats {
    set: string[] = [];
    defaulted: string[] = [];
    unset: string[] = [];
    total = 0;

    addSet(key: string) {
        this.set.push(key);
        this.total++;
    }

    addDefaulted(key: string) {
        this.defaulted.push(key);
        this.total++;
    }

    addUnset(key: string) {
        this.unset.push(key);
        this.total++;
    }

    json(): PhraseyTranslationStatsJson {
        return {
            set: {
                keys: this.set,
                count: this.setCount,
                percent: this.setPercent,
            },
            defaulted: {
                keys: this.defaulted,
                count: this.defaultedCount,
                percent: this.defaultedPercent,
            },
            unset: {
                keys: this.unset,
                count: this.unsetCount,
                percent: this.unsetPercent,
            },
            total: this.total,
            isBuildable: this.isBuildable,
            isStandaloneBuildable: this.isStandaloneBuildable,
        };
    }

    get isBuildable() {
        return this.setCount + this.defaultedCount === this.total;
    }

    get isStandaloneBuildable() {
        return this.setCount === this.total;
    }

    get setCount() {
        return this.set.length;
    }

    get defaultedCount() {
        return this.defaulted.length;
    }

    get unsetCount() {
        return this.unset.length;
    }

    get setPercent() {
        return (this.setCount / this.total) * 100;
    }

    get defaultedPercent() {
        return (this.setCount / this.total) * 100;
    }

    get unsetPercent() {
        return (this.setCount / this.total) * 100;
    }
}
