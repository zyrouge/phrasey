import { z } from "zod";

export const PhraseyZTranslation = z.object({
    locale: z.string(),
    fallback: z.union([z.string(), z.array(z.string())]).optional(),
    extras: z.record(z.any()).optional(),
    keys: z.record(z.string()),
});

export type PhraseyZTranslationType = z.infer<typeof PhraseyZTranslation>;
