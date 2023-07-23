import { PhraseyLocaleCodeDetailsType } from "../../../locale";
import { PhraseyRawLocaleCodeType } from "../codes";
import { PhraseyLocaleCodesExtendedLanguage } from "./language";
import { PhraseyLocaleCodesExtendedScriptCode } from "./script";
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
        const script = await PhraseyLocaleCodesExtendedScriptCode.parse(
            locale,
            displayLocaleCode
        );
        return { language, territory, script };
    }
}
