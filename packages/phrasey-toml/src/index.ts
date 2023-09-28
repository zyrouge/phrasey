import toml from "@iarna/toml";
import type { PhraseyContentFormatter } from "phrasey";

export const contentFormatter: PhraseyContentFormatter = {
    extension: "toml",
    serialize: (content: toml.JsonMap) => toml.stringify(content),
    deserialize: (content: string) => toml.parse(content),
};
