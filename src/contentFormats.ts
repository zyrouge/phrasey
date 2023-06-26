import { PhraseyError } from "./error";
import { PhraseySafeResolvePackage } from "./utils";

export interface PhraseyContentFormatSerializer {
    extension: string;
    serialize(content: any): string;
}

export interface PhraseyContentFormatDeserializer {
    deserialize(content: string): any;
}

export class PhraseyContentFormats {
    static serializerPackages: Record<string, string> = {
        json: "@zyrouge/phrasey-json",
        yaml: "@zyrouge/phrasey-yaml",
        xml: "@zyrouge/phrasey-xml",
    };

    static deserializerPackages: Record<string, string> = {
        json: "@zyrouge/phrasey-json",
        yaml: "@zyrouge/phrasey-yaml",
        toml: "@zyrouge/phrasey-toml",
        xml: "@zyrouge/phrasey-xml",
    };

    static resolveSerializer(name: string): PhraseyContentFormatSerializer {
        const packageName = this.serializerPackages[name] ?? name;
        const pkg = PhraseySafeResolvePackage(packageName);
        if (
            typeof pkg?.serializer === "object" &&
            typeof pkg.serializer.extension === "string" &&
            typeof pkg.serializer.serialize === "function"
        ) {
            return pkg.serializer;
        }
        throw new PhraseyError(
            `Missing implementation of serializer in package "${name}"`
        );
    }

    static resolveDeserializer(name: string): PhraseyContentFormatDeserializer {
        const packageName = this.deserializerPackages[name] ?? name;
        const pkg = PhraseySafeResolvePackage(packageName);
        if (
            typeof pkg?.deserializer === "object" &&
            typeof pkg.deserializer.deserialize === "function"
        ) {
            return pkg.deserializer;
        }
        throw new PhraseyError(
            `Missing implementation of deserializer in package "${name}"`
        );
    }
}
