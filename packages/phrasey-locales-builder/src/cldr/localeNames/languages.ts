import { PhraseyCldrJson } from "../json";
import { PhraseyCldrLocaleBaseType } from "../localeBase";

export type PhraseyCldrLocaleNamesLanguagesType<Code extends string> =
    PhraseyCldrLocaleBaseType<
        Code,
        {
            localeDisplayNames: {
                languages: Record<string, string>;
            };
        }
    >;

export class PhraseyCldrLocaleNamesLanguages {
    static async parse(
        code: string,
    ): Promise<PhraseyCldrLocaleNamesLanguagesType<string>> {
        return PhraseyCldrJson.parse(
            "cldr-localenames-modern",
            `main/${code}/languages.json`,
        );
    }
}
