import { PhraseyCldrLocaleBaseType } from "../localeBase";
import { PhraseyCldrJson } from "../json";

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
