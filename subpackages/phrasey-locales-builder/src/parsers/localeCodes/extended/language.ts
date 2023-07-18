import { PhraseyCldrLocaleNamesLanguages } from "../../../cldr";
import { PhraseyLocaleCodeExtendedCodeType } from "../../../locale";
import { PhraseyRawLocaleCodeType } from "../codes";

export class PhraseyLocaleCodesExtendedLanguage {
    static async parse(
        { code, language }: PhraseyRawLocaleCodeType,
        displayLocaleCode: string
    ): Promise<PhraseyLocaleCodeExtendedCodeType> {
        const display = await this.parseDisplay(displayLocaleCode, language);
        const native = await this.parseDisplay(code, language);
        return {
            display,
            native,
            code: language,
        };
    }

    static async parseDisplay(code: string, language: string): Promise<string> {
        const data = await PhraseyCldrLocaleNamesLanguages.parse(code);
        return data.main[code]!.localeDisplayNames.languages[language]!;
    }
}
