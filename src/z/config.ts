import { z } from "zod";

export const PhraseyZConfigSchema = z.object({
    file: z.string(),
    format: z.string(),
});

export const PhraseyZConfigInput = z.object({
    files: z.union([z.string(), z.array(z.string())]),
    format: z.string(),
    fallback: z.union([z.string(), z.array(z.string())]).optional(),
});

export const PhraseyZConfigOutput = z.object({
    dir: z.string(),
    format: z.string(),
    stringFormat: z.string(),
});

export const PhraseyZConfigHooks = z.object({
    files: z.array(z.string()),
});

export const PhraseyZConfig = z.object({
    schema: PhraseyZConfigSchema,
    input: PhraseyZConfigInput,
    output: PhraseyZConfigOutput.optional(),
    hooks: PhraseyZConfigHooks.optional(),
});

export type PhraseyZConfigType = z.infer<typeof PhraseyZConfig>;
export type PhraseyZConfigSchemaType = z.infer<typeof PhraseyZConfigSchema>;
export type PhraseyZConfigInputType = z.infer<typeof PhraseyZConfigInput>;
export type PhraseyZConfigOutputType = z.infer<typeof PhraseyZConfigOutput>;
export type PhraseyZConfigHooksType = z.infer<typeof PhraseyZConfigHooks>;
