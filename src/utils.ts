export const PhraseyUtils = {
    isNotBlankString: (value: any): value is string =>
        typeof value === "string" && value.trim() !== "",
    isObject: (value: any): value is object =>
        typeof value === "object" && !Array.isArray(value),
    calculatePercentage: (x: number, total: number) => (x / total) * 100,
};
