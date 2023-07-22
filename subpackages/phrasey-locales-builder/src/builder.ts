import { PhraseyLocaleCodeDetailsType, PhraseyLocaleType } from "./locale";
import {
    PhraseyLocaleCodeLayout,
    PhraseyLocaleCodes,
    PhraseyLocaleCodesDetails,
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
            const details = await PhraseyLocaleCodesDetails.parse(
                rawLocaleCode,
                options.displayLocaleCode
            );
            const display = this.constructDisplay(details);
            const native = this.constructNative(details);
            const direction = await PhraseyLocaleCodeLayout.parse(
                rawLocaleCode
            );
            locales.push({
                display,
                native,
                code,
                details,
                direction,
            });
        }
        return locales;
    }

    static constructDisplay(extended: PhraseyLocaleCodeDetailsType) {
        let out = `${extended.language.display}`;
        if (extended.territory) {
            out += ` (${extended.territory.display})`;
        }
        if (extended.script) {
            out += ` (${extended.script.display})`;
        }
        return out;
    }

    static constructNative(extended: PhraseyLocaleCodeDetailsType) {
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
