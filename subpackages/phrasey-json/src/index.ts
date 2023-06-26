import type {
    PhraseyContentFormatSerializer,
    PhraseyContentFormatDeserializer,
} from "phrasey/formats";

export const serializer: PhraseyContentFormatSerializer = {
    extension: "json",
    serialize: (content: any) => JSON.stringify(content),
};

export const deserializer: PhraseyContentFormatDeserializer = {
    deserialize: (content: string) => JSON.parse(content),
};
