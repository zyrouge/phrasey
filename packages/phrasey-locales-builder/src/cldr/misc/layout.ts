import { PhraseyCldrJson } from "../json";
import { PhraseyCldrLocaleBaseType } from "../localeBase";

export type PhraseyCldrMiscLayoutCharacterOrderType =
    | "left-to-right"
    | "right-to-left";

export type PhraseyCldrMiscLayoutLineOrderType = "top-to-bottom";

export type PhraseyCldrMiscLayoutType<Code extends string> =
    PhraseyCldrLocaleBaseType<
        Code,
        {
            layout: {
                orientation: {
                    characterOrder: PhraseyCldrMiscLayoutCharacterOrderType;
                    lineOrder: PhraseyCldrMiscLayoutLineOrderType;
                };
            };
        }
    >;

export class PhraseyCldrMiscLayout {
    static async parse(
        code: string,
    ): Promise<PhraseyCldrMiscLayoutType<string>> {
        return PhraseyCldrJson.parse(
            "cldr-misc-modern",
            `main/${code}/layout.json`,
        );
    }
}
