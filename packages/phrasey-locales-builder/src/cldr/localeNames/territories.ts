import { PhraseyCldrLocaleBaseType } from "../localeBase";
import { PhraseyCldrJson } from "../json";

export type PhraseyCldrLocaleNamesTerritoriesType<Code extends string> =
    PhraseyCldrLocaleBaseType<
        Code,
        {
            localeDisplayNames: {
                territories: Record<string, string>;
            };
        }
    >;

export class PhraseyCldrLocaleNamesTerritories {
    static async parse(
        code: string,
    ): Promise<PhraseyCldrLocaleNamesTerritoriesType<string>> {
        return PhraseyCldrJson.parse(
            "cldr-localenames-modern",
            `main/${code}/territories.json`,
        );
    }
}
