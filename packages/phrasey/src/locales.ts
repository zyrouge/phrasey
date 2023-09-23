import { PhraseyDefaultLocales } from "@zyrouge/phrasey-locales";
import { PhraseyContentFormats } from "./contentFormats";
import { PhraseyTransformer } from "./transformer";
import { PhraseyZLocales, PhraseyZLocalesType } from "./z";
import { PhraseyResult } from "./result";

export * from "@zyrouge/phrasey-locales";

export class PhraseyLocales {
    constructor(public all: PhraseyZLocalesType) {}

    static async create(
        path: string,
        format: string,
    ): Promise<PhraseyResult<PhraseyLocales, Error>> {
        const locales = await PhraseyTransformer.transform(
            path,
            PhraseyContentFormats.resolve(format),
            PhraseyZLocales,
        );
        if (!locales.success) {
            return locales;
        }
        return {
            success: true,
            data: new PhraseyLocales(locales.data),
        };
    }

    static defaultLocales() {
        return new PhraseyLocales(PhraseyDefaultLocales);
    }
}
