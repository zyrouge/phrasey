import { PhraseyError } from "./errors";
import { PhraseyResult } from "./result";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require("../package.json");

export const PhraseyVersion = version;

export const PhraseyIdentifierRegex = /^[A-z][A-z0-9_]*$/;

export interface PhraseyTreeLikeOptions<T> {
    map?: (value: T) => string;
    prefix?: string;
    symbolPostMap?: (symbol: string) => string;
}

export const PhraseyTreeLike = {
    LR: "─",
    TBR: "├",
    TR: "└",
    build: <T>(
        data: T | T[],
        { map, prefix = "", symbolPostMap }: PhraseyTreeLikeOptions<T> = {},
    ) => {
        const lines: string[] = [];
        const dataArray = Array.isArray(data) ? data : [data];
        dataArray.forEach((x, i) => {
            let prefixSymbol =
                i === dataArray.length - 1
                    ? PhraseyTreeLike.TR
                    : PhraseyTreeLike.TBR;
            prefixSymbol += PhraseyTreeLike.LR;
            if (symbolPostMap) {
                prefixSymbol = symbolPostMap(prefixSymbol);
            }
            const text = PhraseyTreeLike.spacify(`${map?.(x) ?? x}`);
            lines.push(`${prefix}${prefixSymbol} ${text}`);
        });
        return lines.join("\n");
    },
    tab: (count: number) => "   ".repeat(count),
    spacify: (text: string) => {
        const lines = text.split("\n").map((x, i) => {
            if (i === 0) return x;
            return `${PhraseyTreeLike.tab(1)}${x}`;
        });
        return lines.join("\n");
    },
};

export const PhraseySafeResolvePackage = (packageName: string) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require(packageName);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        throw new PhraseyError(
            `Cannot import format package named "${packageName}". Did you install it?`,
        );
    }
};

export class PhraseyUtils {
    static parseStringArrayNullable(data?: string | string[] | null): string[] {
        if (typeof data === "string") return [data];
        if (Array.isArray(data)) return data;
        return [];
    }

    static equals(a: unknown, b: unknown): boolean {
        const aType = typeof a;
        const bType = typeof b;
        if (aType !== bType) {
            return false;
        }
        if (Array.isArray(a)) {
            return this._arrayEquals(a, b as unknown[]);
        }
        if (aType === "object") {
            return this._objectEquals(a as object, b as object);
        }
        return a === b;
    }

    static _arrayEquals(a: unknown[], b: unknown[]): boolean {
        if (a.length !== b.length) {
            return false;
        }
        return a.every((x, i) => PhraseyUtils.equals((b as unknown[])[i], x));
    }

    static _objectEquals(a: object, b: object): boolean {
        const aKeys = Object.keys(a) as (keyof typeof a)[];
        const bKeys = Object.keys(b) as (keyof typeof a)[];
        if (aKeys.length !== bKeys.length) {
            return false;
        }
        return aKeys.every((x) => this.equals(b[x], a[x]));
    }
}

export type PhraseyPipelineTask<T = true> = () => Promise<
    PhraseyResult<T, Error | Error[]>
>;

export interface PhraseyPipeline<T = true> {
    execute: () => Promise<PhraseyResult<T, Error | Error[]>>;
}

export class PhraseyBuildablePipeline implements PhraseyPipeline {
    tasks: PhraseyPipelineTask[] = [];

    add(task: PhraseyPipelineTask) {
        this.tasks.push(task);
    }

    build(): PhraseyPipeline {
        return this;
    }

    buildWithOutput<T>(output: PhraseyPipelineTask<T>): PhraseyPipeline<T> {
        return {
            execute: async () => {
                const result = await this.execute();
                if (!result.success) {
                    return result;
                }
                return PhraseyBuildablePipeline.executeTask(output);
            },
        };
    }

    async execute(): Promise<PhraseyResult<true, Error | Error[]>> {
        for (const x of this.tasks) {
            const result = await PhraseyBuildablePipeline.executeTask(x);
            if (!result.success) {
                return result;
            }
        }
        return { success: true, data: true };
    }

    static async executeTask<T>(
        task: PhraseyPipelineTask<T>,
    ): Promise<PhraseyResult<T, Error | Error[]>> {
        try {
            const result = await task();
            return result;
        } catch (error) {
            return {
                success: false,
                error: new PhraseyError("Unexpected pipeline task error", {
                    cause: error,
                }),
            };
        }
    }
}
