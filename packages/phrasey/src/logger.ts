import pico from "picocolors";
import { inspect } from "util";
import { PhraseyTreeLike } from "./utils";

export interface PhraseyLoggerOptions {
    tag?: string;
    write: (text: string) => void;
    writeError: (error: unknown) => void;
}

export type PhraseyLogLevel = "success" | "info" | "warn" | "error";

export class PhraseyLogger {
    constructor(public readonly options: PhraseyLoggerOptions) {}

    success(text: string) {
        this.log("success", text);
    }

    info(text: string) {
        this.log("info", text);
    }

    warn(text: string) {
        this.log("warn", text);
    }

    error(text: string, error?: unknown) {
        this.log("error", text);
        if (!error) return;
        this.logErrors(error);
    }

    logErrors(errors: unknown | unknown[]) {
        const errorsArray = Array.isArray(errors) ? errors : [errors];
        errorsArray.forEach((x) => {
            const raw = inspect(x, {
                colors: false,
            });
            const pretty = raw
                .split(/\s*{\s*\[cause\]:\s*/g)
                .map((x, i) => {
                    const pretty = x
                        .replaceAll(/^\s*}\s*$/gm, "")
                        .replace(/^\s+/gm, PhraseyTreeLike.tab(i))
                        .trim();
                    return PhraseyTreeLike.build(pretty, {
                        prefix: PhraseyTreeLike.tab(i),
                    });
                })
                .join("\n");
            this.writeError(pico.red(pretty));
        });
    }

    grayed(text: string) {
        this.write(pico.gray(text));
    }

    ln() {
        this.write("");
    }

    log(level: PhraseyLogLevel, text: string) {
        this.write(`${this._prefix(level)} ${text}`);
    }

    write(text: string) {
        this.options.write(text);
    }

    writeError(error: unknown) {
        this.options.writeError(error);
    }

    inherit(tag: string) {
        const log = new PhraseyLogger({
            tag,
            write: this.options.write,
            writeError: this.options.writeError,
        });
        return log;
    }

    _level(level: PhraseyLogLevel) {
        switch (level) {
            case "success":
                return pico.green("[success]");

            case "info":
                return pico.cyan("[info]");

            case "warn":
                return pico.yellow("[warn]");

            case "error":
                return pico.red("[error]");
        }
    }

    _prefix(level: PhraseyLogLevel) {
        const tag = this.options.tag
            ? ` ${pico.magenta(`(${this.options.tag})`)}`
            : "";
        return `${this._level(level)}${tag}`;
    }

    static console(tag?: string) {
        const log = new PhraseyLogger({
            tag,
            write: (text) => console.log(text),
            writeError: (error) => console.error(error),
        });
        return log;
    }
}
