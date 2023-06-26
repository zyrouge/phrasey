import { readFile } from "fs-extra";
import { ZodTypeDef, z } from "zod";
import { PhraseyResult, safeRun, safeRunAsync } from "./result";
import { PhraseyContentFormatDeserializer } from "./contentFormats";
import { PhraseyValidationError } from "./error";

export class PhraseyTransformer {
    static async transform<Output, Def extends ZodTypeDef, Input>(
        path: string,
        deserializer: PhraseyContentFormatDeserializer,
        schema: z.ZodType<Output, Def, Input>
    ): Promise<PhraseyResult<Output, Error>> {
        const content = await safeRunAsync(
            async () => await readFile(path, { encoding: "utf-8" })
        );
        if (!content.success) return content;
        const parsed = safeRun(() => deserializer.deserialize(content.data));
        if (!parsed.success) return parsed;
        const transformed = schema.safeParse(parsed.data);
        if (!transformed.success) {
            return {
                success: false,
                error: new PhraseyValidationError(
                    `Parsing "${path}" failed due to validation errors`,
                    transformed.error
                ),
            };
        }
        return {
            success: true,
            data: transformed.data,
        };
    }
}
