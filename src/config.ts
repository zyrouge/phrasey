import { z } from "zod";

export const PhraseyConfigSchema = z.object({
    file: z.string(),
    format: z.string(),
});

export const PhraseyConfigInput = z.object({
    files: z.union([z.string(), z.array(z.string())]),
    default: z.string().optional(),
    format: z.string(),
});

export const PhraseyConfigOutput = z.object({
    dir: z.string(),
    format: z.string(),
    stringFormat: z.string(),
});

export const PhraseyConfigHooks = z.object({
    file: z.string(),
});

export const PhraseyConfig = z.object({
    schema: PhraseyConfigSchema,
    input: PhraseyConfigInput,
    output: PhraseyConfigOutput.optional(),
    hooks: PhraseyConfigHooks.optional(),
});

export type PhraseyConfigType = z.infer<typeof PhraseyConfig>;
export type PhraseyConfigSchemaType = z.infer<typeof PhraseyConfigSchema>;
export type PhraseyConfigInputType = z.infer<typeof PhraseyConfigInput>;
export type PhraseyConfigOutputType = z.infer<typeof PhraseyConfigOutput>;
export type PhraseyConfigHooksType = z.infer<typeof PhraseyConfigHooks>;
