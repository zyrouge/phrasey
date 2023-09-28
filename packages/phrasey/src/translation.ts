import p from "path";
import { PhraseyError } from "./errors";
import { PhraseyContentFormatter } from "./contentFormats";
import { PhraseyLocaleType, PhraseyLocales } from "./locales";
import { PhraseyResult } from "./result";
import { PhraseyTransformer } from "./transformer";
import { PhraseyTranslationStringFormatter } from "./translationStringFormat";
import { PhraseySchema } from "./schema";
import { PhraseyZSchemaKeyType, PhraseyZTranslation } from "./z";
import { PhraseyUtils } from "./utils";

export interface PhraseyTranslationStringPart {
    type: "string" | "parameter";
    value: string;
}

export type PhraseyTranslationStringParts = PhraseyTranslationStringPart[];

export interface PhraseyTranslationStringSet {
    state: "set" | "fallback";
    parts: PhraseyTranslationStringParts;
}

export interface PhraseyTranslationStringUnset {
    state: "unset";
}

export type PhraseyTranslationStringValue =
    | PhraseyTranslationStringSet
    | PhraseyTranslationStringUnset;

export type PhraseyTranslationState =
    | PhraseyTranslationStringSet["state"]
    | PhraseyTranslationStringUnset["state"];

export interface PhraseyTranslationJson {
    locale: PhraseyLocaleType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extras: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keys: Record<string, any>;
}

export class PhraseyTranslation {
    keys = new Map<string, PhraseyTranslationStringValue>();
    stats = new PhraseyTranslationStats();

    constructor(
        public path: string,
        public schema: PhraseySchema,
        public locale: PhraseyLocaleType,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public extras: Record<string, any>,
        public fallback: string[],
    ) {}

    setKey(key: string, value: PhraseyTranslationStringValue) {
        const pValue = this.keys.get(key);
        if (pValue) {
            this.stats.unprocess(key, pValue);
        }
        this.keys.set(key, value);
        this.stats.process(key, value);
    }

    getKey(key: string) {
        return this.keys.get(key);
    }

    hasKey(key: string) {
        return this.keys.has(key);
    }

    keysCount() {
        return this.keys.size;
    }

    json(
        stringFormatter: PhraseyTranslationStringFormatter,
    ): PhraseyTranslationJson {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const keys: Record<string, any> = {};
        for (const [k, v] of this.keys.entries()) {
            if (v.state === "set" || v.state === "fallback") {
                const keySchema = this.schema.key(k);
                try {
                    keys[k] = stringFormatter.format(v.parts, keySchema);
                } catch (error) {
                    throw new PhraseyError(
                        "Formatting translation string failed",
                        { cause: error },
                    );
                }
            }
        }
        return { locale: this.locale, extras: this.extras, keys };
    }

    static async create(
        path: string,
        schema: PhraseySchema,
        formatter: PhraseyContentFormatter,
        locales: PhraseyLocales,
        globalFallback: string[],
    ): Promise<PhraseyResult<PhraseyTranslation, Error>> {
        const unprocessed = await PhraseyTransformer.transform(
            path,
            formatter,
            PhraseyZTranslation,
        );
        if (!unprocessed.success) {
            return { success: false, error: unprocessed.error };
        }
        const locale = locales.all.find(
            (x) => x.code === unprocessed.data.locale,
        );
        if (!locale) {
            return {
                success: false,
                error: new PhraseyError(
                    `Invalid locale "${unprocessed.data.locale}"`,
                ),
            };
        }
        const extras = unprocessed.data.extras ?? {};
        const dir = p.dirname(path);
        const fallback = PhraseyUtils.parseStringArrayNullable(
            unprocessed.data.fallback,
        ).map((x) => p.resolve(dir, x));
        fallback.push(...globalFallback);
        const translation = new PhraseyTranslation(
            path,
            schema,
            locale,
            extras,
            fallback,
        );
        for (const x of schema.z.keys) {
            const rawValue = unprocessed.data.keys[x.name];
            if (!rawValue) continue;
            const parts = PhraseyTranslation.parseTranslationKeyValue(
                x,
                rawValue,
            );
            if (!parts.success) return parts;
            translation.setKey(x.name, {
                state: "set",
                parts: parts.data,
            });
        }
        return {
            success: true,
            data: translation,
        };
    }

    static parseTranslationKeyValue(
        key: PhraseyZSchemaKeyType,
        content: string,
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
                            `Unexpected delimiter "{" at ${i}`,
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
                            }`,
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
    fallback: PhraseyTranslationStatsJsonExtendedState;
    unset: PhraseyTranslationStatsJsonExtendedState;
    total: number;
    isBuildable: boolean;
    isStandaloneBuildable: boolean;
}

export class PhraseyTranslationStats {
    set = new Set<string>();
    fallback = new Set<string>();
    unset = new Set<string>();
    total = 0;

    process(key: string, value: PhraseyTranslationStringValue) {
        switch (value.state) {
            case "set":
                this.set.add(key);
                this.total++;
                break;

            case "fallback":
                this.fallback.add(key);
                this.total++;
                break;

            case "unset":
                this.unset.add(key);
                this.total++;
                break;
        }
    }

    unprocess(key: string, value: PhraseyTranslationStringValue) {
        switch (value.state) {
            case "set":
                this.set.delete(key);
                this.total--;
                break;

            case "fallback":
                this.fallback.delete(key);
                this.total--;
                break;

            case "unset":
                this.unset.delete(key);
                this.total--;
                break;
        }
    }

    json(): PhraseyTranslationStatsJson {
        return {
            set: {
                keys: [...this.set],
                count: this.setCount,
                percent: this.setPercent,
            },
            fallback: {
                keys: [...this.fallback],
                count: this.fallbackCount,
                percent: this.fallbackPercent,
            },
            unset: {
                keys: [...this.unset],
                count: this.unsetCount,
                percent: this.unsetPercent,
            },
            total: this.total,
            isBuildable: this.isBuildable,
            isStandaloneBuildable: this.isStandaloneBuildable,
        };
    }

    get isBuildable() {
        return this.setCount + this.fallbackCount === this.total;
    }

    get isStandaloneBuildable() {
        return this.setCount === this.total;
    }

    get setCount() {
        return this.set.size;
    }

    get fallbackCount() {
        return this.fallback.size;
    }

    get unsetCount() {
        return this.unset.size;
    }

    get setPercent() {
        return (this.setCount / this.total) * 100;
    }

    get fallbackPercent() {
        return (this.fallbackCount / this.total) * 100;
    }

    get unsetPercent() {
        return (this.unsetCount / this.total) * 100;
    }
}
