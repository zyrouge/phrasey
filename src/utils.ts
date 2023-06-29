import { PhraseyError } from "./error";
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
        data: T[],
        { map, prefix = "", symbolPostMap }: PhraseyTreeLikeOptions<T> = {}
    ) => {
        const lines: string[] = [];
        data.forEach((x, i) => {
            let prefixSymbol =
                i === data.length - 1
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
    } catch (err) {
        throw new PhraseyError(
            `Cannot import format package named "${packageName}". Did you install it?`
        );
    }
};
