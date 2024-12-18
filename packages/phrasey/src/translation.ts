import p from "path";
import { PhraseyContentFormatter } from "./contentFormats";
import { PhraseyError } from "./errors";
import { PhraseyLocaleType, PhraseyLocales } from "./locales";
import { PhraseyResult } from "./result";
import { PhraseySchema } from "./schema";
import { PhraseyTransformer } from "./transformer";
import { PhraseyTranslationStringFormatter } from "./translationStringFormat";
import { PhraseyUtils } from "./utils";
import { PhraseyZSchemaKeyType, PhraseyZTranslation } from "./z";

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
    state: "unset" | "unknown";
}

export type PhraseyTranslationStringValue =
    | PhraseyTranslationStringSet
    | PhraseyTranslationStringUnset;

export type PhraseyTranslationState =
    | PhraseyTranslationStringSet["state"]
    | PhraseyTranslationStringUnset["state"];

export interface PhraseyTranslationSerialized {
    locale: PhraseyLocaleType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extras: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keys: Record<string, any>;
}

export interface PhraseyTranslationJson {
    locale: PhraseyLocaleType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extras: Record<string, any>;
    keys: Record<string, PhraseyTranslationStringValue>;
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

    serialize(
        stringFormatter: PhraseyTranslationStringFormatter,
    ): PhraseyTranslationSerialized {
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

    json(): PhraseyTranslationJson {
        return {
            locale: this.locale,
            extras: this.extras,
            keys: Object.fromEntries(this.keys.entries()),
        };
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
        const keys = new Set(Object.keys(unprocessed.data.keys));
        for (const x of schema.z.keys) {
            keys.delete(x.name);
            const rawValue = unprocessed.data.keys[x.name];
            if (!rawValue) {
                continue;
            }
            const parts = PhraseyTranslation.parseTranslationKeyValue(
                x,
                rawValue,
            );
            if (!parts.success) {
                return parts;
            }
            translation.setKey(x.name, {
                state: "set",
                parts: parts.data,
            });
        }
        for (const x of keys) {
            translation.setKey(x, {
                state: "unknown",
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

export type PhraseyTranslationStatsJsonBuildable =
    | { status: true }
    | { status: false; reason: string };

export interface PhraseyTranslationStatsJson {
    set: PhraseyTranslationStatsJsonExtendedState;
    fallback: PhraseyTranslationStatsJsonExtendedState;
    unset: PhraseyTranslationStatsJsonExtendedState;
    unknown: PhraseyTranslationStatsJsonExtendedState;
    total: number;
    isBuildable: PhraseyTranslationStatsJsonBuildable;
    isStandaloneBuildable: PhraseyTranslationStatsJsonBuildable;
}

export class PhraseyTranslationStats {
    set = new Set<string>();
    fallback = new Set<string>();
    unset = new Set<string>();
    unknown = new Set<string>();
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

            case "unknown":
                this.unknown.add(key);
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

            case "unknown":
                this.unknown.delete(key);
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
            unknown: {
                keys: [...this.unknown],
                count: this.unknownCount,
                percent: 0,
            },
            total: this.total,
            isBuildable: this.isBuildable,
            isStandaloneBuildable: this.isStandaloneBuildable,
        };
    }

    get isBuildable() {
        const check = this.setCount + this.fallbackCount === this.total;
        if (check) {
            return {
                status: true,
            } satisfies PhraseyTranslationStatsJsonBuildable;
        }
        return {
            status: false,
            reason: `Missing keys (${PhraseyTranslationStats._generateMissingKeysHint(this.unset)})`,
        } satisfies PhraseyTranslationStatsJsonBuildable;
    }

    get isStandaloneBuildable() {
        const check = this.setCount === this.total;
        if (check) {
            return {
                status: true,
            } satisfies PhraseyTranslationStatsJsonBuildable;
        }
        return {
            status: false,
            reason: `Missing keys (${PhraseyTranslationStats._generateMissingKeysHint(this.fallback, this.unset)})`,
        } satisfies PhraseyTranslationStatsJsonBuildable;
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

    get unknownCount() {
        return this.unknown.size;
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

    static _generateMissingKeysHint(...collection: Set<string>[]) {
        const keys: string[] = [];
        for (const x of collection) {
            for (const y of x) {
                if (keys.length == 2) {
                    break;
                }
                keys.push(y);
            }
            if (keys.length == 2) {
                break;
            }
        }
        const remaining =
            collection.reduce((pv, cv) => cv.size + pv, 0) - keys.length;
        const hint = keys.join(", ");
        if (remaining === 0) {
            return hint;
        }
        return `${hint} and ${remaining} more`;
    }
}
