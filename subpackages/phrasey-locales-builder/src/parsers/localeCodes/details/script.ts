import { PhraseyCldrLocaleNamesScripts } from "../../../cldr";
import { PhraseyLocaleCodeDetailsCodeType } from "../../../locale";
import { PhraseyRawLocaleCodeType } from "../codes";

export class PhraseyLocaleCodesExtendedScriptCode {
    static async parse(
        { code, script }: PhraseyRawLocaleCodeType,
        displayLocaleCode: string
    ): Promise<PhraseyLocaleCodeDetailsCodeType | undefined> {
        if (!script) return;
        const display = await this.parseDisplay(displayLocaleCode, script);
        const native = await this.parseDisplay(code, script);
        return {
            display,
            native,
            code: script,
        };
    }

    static async parseDisplay(code: string, script: string): Promise<string> {
        const data = await PhraseyCldrLocaleNamesScripts.parse(code);
        return data.main[code]!.localeDisplayNames.scripts[script]!;
    }
}
