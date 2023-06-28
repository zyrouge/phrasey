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
            lines.push(`${prefix}${prefixSymbol} ${map?.(x) ?? x}`);
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
