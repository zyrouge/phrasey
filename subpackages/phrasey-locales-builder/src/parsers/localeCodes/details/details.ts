import { PhraseyLocaleCodeDetailsType } from "../../../locale";
import { PhraseyRawLocaleCodeType } from "../codes";
import { PhraseyLocaleCodesExtendedLanguage } from "./language";
import { PhraseyLocaleCodesExtendedTerritory } from "./territory";

export class PhraseyLocaleCodesDetails {
    static async parse(
        locale: PhraseyRawLocaleCodeType,
        displayLocaleCode: string
    ): Promise<PhraseyLocaleCodeDetailsType> {
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
