import { PhraseyContentFormats } from "./contentFormats";
import { PhraseyResult } from "./result";
import { PhraseyTransformer } from "./transformer";
import { PhraseySafeResolvePackage } from "./utils";
import { PhraseyZLocales, PhraseyZLocalesType } from "./z";

export * from "@zyrouge/phrasey-locales-shared";

export interface PhraseyLocalesJson {
    all: PhraseyZLocalesType;
}

export class PhraseyLocales {
    constructor(public all: PhraseyZLocalesType) {}

    json(): PhraseyLocalesJson {
        return this;
    }

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
