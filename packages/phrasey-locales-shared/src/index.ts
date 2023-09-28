export type PhraseyLocaleDirectionType = "ltr" | "rtl";

export interface PhraseyLocaleCodeDetailsCodeType {
    display: string;
    native: string;
    code: string;
}

export interface PhraseyLocaleCodeDetailsType {
    language: PhraseyLocaleCodeDetailsCodeType;
    territory?: PhraseyLocaleCodeDetailsCodeType;
    script?: PhraseyLocaleCodeDetailsCodeType;
}

export interface PhraseyLocaleType {
    display: string;
    native: string;
    code: string;
    details: PhraseyLocaleCodeDetailsType;
    direction: PhraseyLocaleDirectionType;
}
