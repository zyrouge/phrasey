import type { PhraseyContentFormatter } from "phrasey";

export const contentFormatter: PhraseyContentFormatter = {
    extension: "json",
    serialize: (content: any) => JSON.stringify(content),
    deserialize: (content: string) => JSON.parse(content),
};
