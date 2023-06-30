import type { PhraseyContentFormatter } from "phrasey";
import yaml from "yaml";

export const contentFormatter: PhraseyContentFormatter = {
    extension: "yaml",
    serialize: (content: any) => yaml.stringify(content),
    deserialize: (content: string) => yaml.parse(content),
};
