import { PhraseyError } from "./errors";
import { PhraseyResult } from "./result";
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
        return require(packageName);
    } catch (error) {
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

    static equals(a: any, b: any): boolean {
        const aType = typeof a;
        const bType = typeof b;
        if (aType !== bType) {
            return false;
        }
        if (Array.isArray(a)) {
            if (a.length !== b.length) {
                return false;
            }
            return a.every((x, i) => PhraseyUtils.equals(b[i], x));
        }
        if (aType === "object") {
            const aKeys = Object.keys(a);
            const bKeys = Object.keys(b);
            if (aKeys.length !== bKeys.length) {
                return false;
            }
            return aKeys.every((x) => PhraseyUtils.equals(b[x], a[x]));
        }
        return a === b;
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
