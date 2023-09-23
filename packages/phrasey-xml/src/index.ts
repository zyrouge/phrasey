import type { PhraseyContentFormatter } from "phrasey";
import xml from "xml-js";

export const contentFormatter: PhraseyContentFormatter = {
    extension: "xml",
    serialize: (content: any) => xml.xml2json(content),
    deserialize: (content: string) => xml.json2xml(content),
};
