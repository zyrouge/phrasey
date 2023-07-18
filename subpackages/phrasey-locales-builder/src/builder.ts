import { PhraseyLocaleCodeExtendedType, PhraseyLocaleType } from "./locale";
import {
    PhraseyLocaleCodeLayout,
    PhraseyLocaleCodes,
    PhraseyLocaleCodesExtended,
} from "./parsers";

export interface PhraseyLocaleBuilderOptions {
    displayLocaleCode: string;
}

export class PhraseyLocaleBuilder {
    static async build(
        options: PhraseyLocaleBuilderOptions
    ): Promise<PhraseyLocaleType[]> {
        const locales: PhraseyLocaleType[] = [];
        const localeCodes = await PhraseyLocaleCodes.parseAll();
        for (const code of localeCodes) {
            // "und" is used for undetermined primary language
            if (code === "und") continue;
            const rawLocaleCode = await PhraseyLocaleCodes.parse(code);
            const extended = await PhraseyLocaleCodesExtended.parse(
                rawLocaleCode,
                options.displayLocaleCode
            );
            const display = this.constructDisplay(extended);
            const native = this.constructNative(extended);
            const direction = await PhraseyLocaleCodeLayout.parse(
                rawLocaleCode
            );
            locales.push({
                display,
                native,
                code,
                extended,
                direction,
            });
        }
        return locales;
    }

    static constructDisplay(extended: PhraseyLocaleCodeExtendedType) {
        let out = `${extended.language.display}`;
        if (extended.territory) {
            out += ` (${extended.territory.display})`;
        }
        if (extended.script) {
            out += ` (${extended.script.display})`;
        }
        return out;
    }

    static constructNative(extended: PhraseyLocaleCodeExtendedType) {
        let out = `${extended.language.native}`;
        if (extended.territory) {
            out += ` (${extended.territory.native})`;
        }
        if (extended.script) {
            out += ` (${extended.script.native})`;
        }
        return out;
    }
}
