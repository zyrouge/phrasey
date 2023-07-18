import { PhraseyLocaleCodeExtendedType } from "../../../locale";
import { PhraseyRawLocaleCodeType } from "../codes";
import { PhraseyLocaleCodesExtendedLanguage } from "./language";
import { PhraseyLocaleCodesExtendedTerritory } from "./territory";

export class PhraseyLocaleCodesExtended {
    static async parse(
        locale: PhraseyRawLocaleCodeType,
        displayLocaleCode: string
    ): Promise<PhraseyLocaleCodeExtendedType> {
        const language = await PhraseyLocaleCodesExtendedLanguage.parse(
            locale,
            displayLocaleCode
        );
        const territory = await PhraseyLocaleCodesExtendedTerritory.parse(
            locale,
            displayLocaleCode
        );
        const script = await PhraseyLocaleCodesExtendedLanguage.parse(
            locale,
            displayLocaleCode
        );
        return { language, territory, script };
    }
}
