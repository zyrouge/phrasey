import { z } from "zod";

export const PhraseyZLocaleDirection = z.enum(["ltr", "rtl"]);

export const PhraseyZLocaleCodeDetailsCode = z.object({
    display: z.string(),
    native: z.string(),
    code: z.string(),
});

export const PhraseyZLocaleCodeDetails = z.object({
    language: PhraseyZLocaleCodeDetailsCode,
    territory: PhraseyZLocaleCodeDetailsCode.optional(),
    script: PhraseyZLocaleCodeDetailsCode.optional(),
});

export const PhraseyZLocale = z.object({
    display: z.string(),
    native: z.string(),
    code: z.string(),
    details: PhraseyZLocaleCodeDetails,
    direction: PhraseyZLocaleDirection,
});

export const PhraseyZLocales = z.array(PhraseyZLocale);

export type PhraseyZLocaleDirection = z.infer<typeof PhraseyZLocaleDirection>;
export type PhraseyZLocaleCodeDetailsCode = z.infer<
    typeof PhraseyZLocaleCodeDetailsCode
>;
export type PhraseyZLocale = z.infer<typeof PhraseyZLocale>;
export type PhraseyZLocalesType = z.infer<typeof PhraseyZLocales>;
