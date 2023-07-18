export type PhraseyLocaleDirectionType = "ltr" | "rtl";

export interface PhraseyLocaleCodeExtendedCodeType {
    display: string;
    native: string;
    code: string;
}

export interface PhraseyLocaleCodeExtendedType {
    language: PhraseyLocaleCodeExtendedCodeType;
    territory?: PhraseyLocaleCodeExtendedCodeType;
    script?: PhraseyLocaleCodeExtendedCodeType;
}

export interface PhraseyLocaleType {
    display: string;
    native: string;
    code: string;
    extended: PhraseyLocaleCodeExtendedType;
    direction: PhraseyLocaleDirectionType;
}
