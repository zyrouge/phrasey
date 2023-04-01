export const PhraseyUtils = {
    isBlankString: (value: any) =>
        typeof value !== "string" || value.trim() === "",
    isNotBlankString: (value: any): value is string =>
        !PhraseyUtils.isBlankString(value),
    isObject: (value: any): value is object =>
        typeof value === "object" && !Array.isArray(value),
    calculatePercentage: (x: number, total: number) => (x / total) * 100,
};
