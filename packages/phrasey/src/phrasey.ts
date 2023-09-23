import p from "path";
import { PhraseyLogger } from "./logger";

export interface PhraseyProps {
    cwd: string;
    log: PhraseyLogger;
}

export interface PhraseyOptions extends PhraseyProps {
    source?: string;
}

export class Phrasey implements PhraseyProps {
    cwd: string;
    log: PhraseyLogger;

    constructor(public readonly options: PhraseyOptions) {
        this.cwd = options.cwd;
        this.log = options.log;
    }

    path(...parts: string[]) {
        return p.resolve(this.cwd, ...parts);
    }

    rpath(path: string) {
        return p.relative(this.cwd, path);
    }
}
