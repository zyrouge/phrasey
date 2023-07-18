import { PhraseyCldrLocaleNamesScripts } from "../../../cldr";
import { PhraseyLocaleCodeExtendedCodeType } from "../../../locale";
import { PhraseyRawLocaleCodeType } from "../codes";

export class PhraseyLocaleCodesExtendedScriptCode {
    async parse(
        { code, script }: PhraseyRawLocaleCodeType,
        displayLocaleCode: string
    ): Promise<PhraseyLocaleCodeExtendedCodeType | undefined> {
        if (!script) return;
        const display = await this.parseDisplay(displayLocaleCode, script);
        const native = await this.parseDisplay(code, script);
        return {
            display,
            native,
            code: script,
        };
    }

    async parseDisplay(code: string, script: string): Promise<string> {
        const data = await PhraseyCldrLocaleNamesScripts.parse(code);
        return data.main[code]!.localeDisplayNames.scripts[script!]!;
    }
}
