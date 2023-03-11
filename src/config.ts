import { PhraseyTranslation } from "./phrasey";

export type PhraseyConfigKeys = readonly string[];

export interface PhraseyConfig<Keys extends PhraseyConfigKeys> {
    rootDir?: string;
    input: {
        include: string[];
        exclude?: string[];
    };
    defaultLocale?: string;
    keys: Keys;
    transpile: {
        beforeTranspilingFile?(content: any): Promise<any>;
        afterTranspilingFile?(
            translation: PhraseyTranslation<Keys>
        ): Promise<PhraseyTranslation<Keys>>;
        beforeOutput?(): Promise<void>;
        output(translation: PhraseyTranslation<Keys>): Promise<{
            path: string;
            content: string;
        }>;
    };
    log?(text: string): void;
}

export const definePhraseyConfig = <Keys extends PhraseyConfigKeys>(
    config: PhraseyConfig<Keys>
) => {
    return config;
};
