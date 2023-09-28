import { PhraseyError } from "./errors";
import { PhraseySafeResolvePackage } from "./utils";

export interface PhraseyContentFormatter {
    extension: string;
    serialize(content: unknown): string;
    deserialize(content: string): unknown;
}

export class PhraseyContentFormats {
    static defaultPackages: Record<string, string> = {
        json: "@zyrouge/phrasey-json",
        toml: "@zyrouge/phrasey-toml",
        yaml: "@zyrouge/phrasey-yaml",
        xml: "@zyrouge/phrasey-xml",
    };

    static resolve(name: string): PhraseyContentFormatter {
        const packageName = this.defaultPackages[name] ?? name;
        const pkg = PhraseySafeResolvePackage(packageName);
        if (typeof pkg?.contentFormatter !== "object") {
            throw new PhraseyError(
                `Missing implementation of "contentFormatter" in package "${name}"`,
            );
        }
        if (typeof pkg.contentFormatter.extension !== "string") {
            throw new PhraseyError(
                `Missing implementation of "contentFormatter.extension" in package "${name}"`,
            );
        }
        if (typeof pkg.contentFormatter.serialize !== "function") {
            throw new PhraseyError(
                `Missing implementation of "contentFormatter.serialize" in package "${name}"`,
            );
        }
        if (typeof pkg.contentFormatter.deserialize !== "function") {
            throw new PhraseyError(
                `Missing implementation of "contentFormatter.deserialize" in package "${name}"`,
            );
        }
        return pkg.contentFormatter;
    }
}
