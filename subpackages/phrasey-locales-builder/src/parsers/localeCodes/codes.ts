import {
    PhraseyCldrCoreAvailableLocales,
    PhraseyCldrLocaleNamesLanguages,
} from "../../cldr";

export interface PhraseyRawLocaleCodeType {
    code: string;
    language: string;
    territory?: string;
    script?: string;
}

export class PhraseyLocaleCodes {
    static async parse(code: string): Promise<PhraseyRawLocaleCodeType> {
        const languages = await PhraseyCldrLocaleNamesLanguages.parse(code);
        const { language, territory, script } = languages.main[code]!.identity;
        return { code, language, territory, script };
    }

    static async parseAll() {
        const availableLocales = await PhraseyCldrCoreAvailableLocales.parse();
        return availableLocales.availableLocales.modern;
    }
}
