import type {
    PhraseyContentFormatDeserializer,
} from "phrasey/formats";
import toml from "toml";

export const deserializer: PhraseyContentFormatDeserializer = {
    deserialize: (content: string) => toml.parse(content),
};
