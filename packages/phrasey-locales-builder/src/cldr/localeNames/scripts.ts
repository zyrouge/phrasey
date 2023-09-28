import { PhraseyCldrJson } from "../json";
import { PhraseyCldrLocaleBaseType } from "../localeBase";

export type PhraseyCldrLocaleNamesScriptsType<Code extends string> =
    PhraseyCldrLocaleBaseType<
        Code,
        {
            localeDisplayNames: {
                scripts: Record<string, string>;
            };
        }
    >;

export class PhraseyCldrLocaleNamesScripts {
    static async parse(
        code: string,
    ): Promise<PhraseyCldrLocaleNamesScriptsType<string>> {
        return PhraseyCldrJson.parse(
            "cldr-localenames-modern",
            `main/${code}/scripts.json`,
        );
    }
}
