import { PhraseyContentFormats } from "./contentFormats";
import { PhraseyResult } from "./result";
import { PhraseyTransformer } from "./transformer";
import { PhraseyZSchema, PhraseyZSchemaKeyType, PhraseyZSchemaType } from "./z";

export class PhraseySchema {
    keysMap = new Map<string, PhraseyZSchemaKeyType>();

    constructor(public z: PhraseyZSchemaType) {}

    initMap() {
        for (const x of this.z.keys) {
            this.keysMap.set(x.name, x);
        }
    }

    key(name: string) {
        return this.keysMap.get(name)!;
    }

    static async create(
        path: string,
        format: string
    ): Promise<PhraseyResult<PhraseySchema, Error>> {
        const z = await PhraseyTransformer.transform(
            path,
            PhraseyContentFormats.resolveDeserializer(format),
            PhraseyZSchema
        );
        if (!z.success) return z;
        const schema = new PhraseySchema(z.data);
        return { success: true, data: schema };
    }
}
