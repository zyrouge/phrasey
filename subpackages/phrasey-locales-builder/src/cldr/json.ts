import p from "path";
import fs from "fs/promises";

export class PhraseyCldrJson {
    static cache = new Map<string, any>();

    static async parse<T>(relativePath: string): Promise<T> {
        const path = p.resolve(__dirname, `../../node_modules`, relativePath);
        const cached = PhraseyCldrJson.cache.get(path);
        if (cached) {
            return cached as T;
        }
        const content = await fs.readFile(path, "utf-8");
        const data = JSON.parse(content) as T;
        return data;
    }
}
