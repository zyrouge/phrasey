import type {
    PhraseyContentFormatSerializer,
    PhraseyContentFormatDeserializer,
} from "phrasey";
import yaml from "yaml";

export const serializer: PhraseyContentFormatSerializer = {
    extension: "yaml",
    serialize: (content: any) => yaml.stringify(content),
};

export const deserializer: PhraseyContentFormatDeserializer = {
    deserialize: (content: string) => yaml.parse(content),
};
