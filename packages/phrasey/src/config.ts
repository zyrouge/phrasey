import { PhraseyContentFormats } from "./contentFormats";
import { PhraseyResult } from "./result";
import { PhraseyTransformer } from "./transformer";
import { PhraseyZConfig, PhraseyZConfigType } from "./z";

export interface PhraseyConfigJson {
    z: PhraseyZConfigType;
}

export class PhraseyConfig {
    constructor(public z: PhraseyZConfigType) {}

    json(): PhraseyConfigJson {
        return this;
    }

    static async create(
        path: string,
        format: string,
    ): Promise<PhraseyResult<PhraseyConfig, Error>> {
        const z = await PhraseyTransformer.transform(
            path,
            PhraseyContentFormats.resolve(format),
            PhraseyZConfig,
        );
        if (!z.success) return z;
        const config = new PhraseyConfig(z.data);
        return { success: true, data: config };
    }
}
