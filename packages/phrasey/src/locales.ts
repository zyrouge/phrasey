import { PhraseyContentFormats } from "./contentFormats";
import { PhraseyTransformer } from "./transformer";
import { PhraseyZLocales, PhraseyZLocalesType } from "./z";
import { PhraseyResult } from "./result";
import { PhraseySafeResolvePackage } from "./utils";

export * from "@zyrouge/phrasey-locales-shared";

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
        const pkg = PhraseySafeResolvePackage("@zyrouge/phrasey-locales");
        return new PhraseyLocales(pkg.PhraseyDefaultLocales);
    }
}
