export interface PhraseyCldrLocaleIdentifyType {
    version: {
        _cldrVersion: string;
    };
    language: string;
    territory?: string;
    script?: string;
}

export interface PhraseyCldrLocaleBaseType<
    Code extends string,
    Data extends object,
> {
    main: {
        [code in Code]: {
            identity: PhraseyCldrLocaleIdentifyType;
        } & Data;
    };
}
