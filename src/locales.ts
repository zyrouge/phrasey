import { PhraseyContentFormats } from "./contentFormats";
import { PhraseyTransformer } from "./transformer";
import { PhraseyZLocales } from "./z";

export * from "@zyrouge/phrasey-locales";

export class PhraseyLocales {
    static async resolve(path: string, format: string) {
        const locales = await PhraseyTransformer.transform(
            path,
            PhraseyContentFormats.resolve(format),
            PhraseyZLocales
        );
        return locales;
    }
}
