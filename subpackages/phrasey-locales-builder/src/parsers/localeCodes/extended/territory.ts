import { PhraseyCldrLocaleNamesTerritories } from "../../../cldr";
import { PhraseyLocaleCodeExtendedCodeType } from "../../../locale";
import { PhraseyRawLocaleCodeType } from "../codes";

export class PhraseyLocaleCodesExtendedTerritory {
    static async parse(
        { code, territory }: PhraseyRawLocaleCodeType,
        displayLocaleCode: string
    ): Promise<PhraseyLocaleCodeExtendedCodeType | undefined> {
        if (!territory) return;
        const display = await this.parseDisplay(displayLocaleCode, territory);
        const native = await this.parseDisplay(code, territory);
        return {
            display,
            native,
            code: territory,
        };
    }

    static async parseDisplay(
        code: string,
        territory: string
    ): Promise<string> {
        const data = await PhraseyCldrLocaleNamesTerritories.parse(code);
        return data.main[code]!.localeDisplayNames.territories[territory!]!;
    }
}
