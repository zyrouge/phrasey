import { z } from "zod";

export const PhraseyZTranslation = z.object({
    locale: z.string(),
    extras: z.record(z.any()).optional(),
    keys: z.record(z.string()),
});

export type PhraseyZTranslationType = z.infer<typeof PhraseyZTranslation>;
