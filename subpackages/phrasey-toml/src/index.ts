import type { PhraseyContentFormatDeserializer } from "phrasey";
import toml from "toml";

export const deserializer: PhraseyContentFormatDeserializer = {
    deserialize: (content: string) => toml.parse(content),
};
