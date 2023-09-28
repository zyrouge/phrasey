import type { PhraseyContentFormatter } from "phrasey";
import yaml from "yaml";

export const contentFormatter: PhraseyContentFormatter = {
    extension: "yaml",
    serialize: (content: unknown) => yaml.stringify(content),
    deserialize: (content: string) => yaml.parse(content),
};
