import { readFile } from "fs-extra";
import { ZodTypeDef, z } from "zod";
import { PhraseyContentFormatter } from "./contentFormats";
import { PhraseyValidationError } from "./errors";
import { PhraseyResult, PhraseySafeRun, PhraseySafeRunAsync } from "./result";

export class PhraseyTransformer {
    static async transform<Output, Def extends ZodTypeDef, Input>(
        path: string,
        formatter: PhraseyContentFormatter,
        schema: z.ZodType<Output, Def, Input>,
    ): Promise<PhraseyResult<Output, Error>> {
        const content = await PhraseySafeRunAsync(
            async () => await readFile(path, { encoding: "utf-8" }),
        );
        if (!content.success) {
            return content;
        }
        const parsed = PhraseySafeRun(() =>
            formatter.deserialize(content.data),
        );
        if (!parsed.success) {
            return parsed;
        }
        const transformed = schema.safeParse(parsed.data);
        if (!transformed.success) {
            return {
                success: false,
                error: new PhraseyValidationError(
                    `Parsing "${path}" failed due to validation errors`,
                    transformed.error,
                ),
            };
        }
        return {
            success: true,
            data: transformed.data,
        };
    }
}
