import { PhraseyContentFormats } from "./contentFormats";
import { PhraseyResult } from "./result";
import { PhraseyTransformer } from "./transformer";
import { PhraseyZSchema, PhraseyZSchemaKeyType, PhraseyZSchemaType } from "./z";

export class PhraseySchema {
    keys = new Map<string, PhraseyZSchemaKeyType>();

    constructor(public z: PhraseyZSchemaType) {}

    init() {
        for (const x of this.z.keys) {
            this.keys.set(x.name, x);
        }
    }

    key(name: string) {
        return this.keys.get(name)!;
    }

    keysCount() {
        return this.keys.size;
    }

    static async create(
        path: string,
        format: string
    ): Promise<PhraseyResult<PhraseySchema, Error>> {
        const z = await PhraseyTransformer.transform(
            path,
            PhraseyContentFormats.resolve(format),
            PhraseyZSchema
        );
        if (!z.success) return z;
        const schema = new PhraseySchema(z.data);
        schema.init();
        return { success: true, data: schema };
    }
}
