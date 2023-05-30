export const PhraseyUtils = {
    isBlankString: (value: any) =>
        typeof value !== "string" || value.trim() === "",
    isNotBlankString: (value: any): value is string =>
        !PhraseyUtils.isBlankString(value),
    isUndefined: (value: any): value is undefined => value === undefined,
    isObject: (value: any): value is object =>
        typeof value === "object" && !Array.isArray(value),
    calculatePercentage: (x: number, total: number) => (x / total) * 100,
    constructLocale: (localeCode: string, countryCode?: string) => {
        if (!countryCode) return localeCode;
        return `${localeCode}_${countryCode}`;
    },
};
