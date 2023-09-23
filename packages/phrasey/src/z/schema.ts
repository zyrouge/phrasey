import { z } from "zod";
import { PhraseyIdentifierRegex } from "../utils";

export const PhraseyZSchemaKey = z.object({
    name: z.string().regex(PhraseyIdentifierRegex),
    description: z.string().optional(),
    parameters: z.array(z.string().regex(PhraseyIdentifierRegex)).optional(),
});

export const PhraseyZSchema = z.object({
    keys: z.array(PhraseyZSchemaKey),
});

export type PhraseyZSchemaType = z.infer<typeof PhraseyZSchema>;
export type PhraseyZSchemaKeyType = z.infer<typeof PhraseyZSchemaKey>;
