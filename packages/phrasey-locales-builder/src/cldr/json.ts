import fs from "fs/promises";
import p from "path";

export type PhraseyCldrModulesType =
    | "cldr-core"
    | "cldr-localenames-modern"
    | "cldr-misc-modern";

export class PhraseyCldrJson {
    static cache = new Map<string, unknown>();

    static async parse<T>(
        module: PhraseyCldrModulesType,
        subpath: string,
    ): Promise<T> {
        // "package.json" to avoid searching entrypoint of the module
        const dir = p.dirname(require.resolve(`${module}/package.json`));
        const path = p.resolve(dir, subpath);
        const cached = PhraseyCldrJson.cache.get(path);
        if (cached) {
            return cached as T;
        }
        const content = await fs.readFile(path, "utf-8");
        const data = JSON.parse(content) as T;
        return data;
    }
}
