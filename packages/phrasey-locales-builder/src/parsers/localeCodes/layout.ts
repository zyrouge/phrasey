import {
    PhraseyCldrMiscLayout,
    PhraseyCldrMiscLayoutCharacterOrderType,
} from "../../cldr";
import { PhraseyLocaleDirectionType } from "../../locale";
import { PhraseyRawLocaleCodeType } from "./codes";

export class PhraseyLocaleCodeLayout {
    /* eslint-disable indent */
    static cldrMiscLayoutCharacterOrderMap: Record<
        PhraseyCldrMiscLayoutCharacterOrderType,
        PhraseyLocaleDirectionType
    > = {
        "left-to-right": "ltr",
        "right-to-left": "rtl",
    };
    /* eslint-enable indent */

    static async parse({ code }: PhraseyRawLocaleCodeType) {
        const layout = await PhraseyCldrMiscLayout.parse(code);
        const { characterOrder } = layout.main[code]!.layout.orientation;
        return this.cldrMiscLayoutCharacterOrderMap[characterOrder];
    }
}
