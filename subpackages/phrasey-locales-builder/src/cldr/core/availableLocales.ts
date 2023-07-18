import { PhraseyCldrJson } from "../json";

export interface PhraseyCldrCoreAvailableLocalesType {
    availableLocales: {
        modern: string[];
        full: string[];
    };
}

export class PhraseyCldrCoreAvailableLocales {
    static async parse(): Promise<PhraseyCldrCoreAvailableLocalesType> {
        return PhraseyCldrJson.parse(`cldr-core/availableLocales.json`);
    }
}
