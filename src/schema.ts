import { z } from "zod";

export const PhraseyIdentifierRegex = /^[A-z][A-z0-9_]*$/;

export const PhraseySchemaKey = z.object({
    name: z.string().regex(PhraseyIdentifierRegex),
    description: z.string().optional(),
    parameters: z.array(z.string().regex(PhraseyIdentifierRegex)).optional(),
});

export type PhraseySchemaKeyType = z.infer<typeof PhraseySchemaKey>;

export const PhraseySchema = z.object({
    keys: z.array(PhraseySchemaKey),
});

export type PhraseySchemaType = z.infer<typeof PhraseySchema>;

export const PhraseyUnprocessedTranslation = z.object({
    locale: z.string(),
    extras: z.record(z.any()).default({}),
    keys: z.record(z.string()),
});

export type PhraseyUnprocessedTranslationType = z.infer<
    typeof PhraseyUnprocessedTranslation
>;
