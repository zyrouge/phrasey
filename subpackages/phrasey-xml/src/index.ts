import type {
    PhraseyContentFormatSerializer,
    PhraseyContentFormatDeserializer,
} from "phrasey";
import xml from "xml-js";

export const serializer: PhraseyContentFormatSerializer = {
    extension: "xml",
    serialize: (content: any) => xml.xml2json(content),
};

export const deserializer: PhraseyContentFormatDeserializer = {
    deserialize: (content: string) => xml.json2xml(content),
};
