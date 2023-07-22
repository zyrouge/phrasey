import pico from "picocolors";

export interface PhraseyLoggerOptions {
    tag?: string;
    write: (text: string) => void;
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

    error(text: string) {
        this.log("error", text);
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

    inherit(tag: string) {
        const log = new PhraseyLogger({ tag, write: this.options.write });
        return log;
    }

    _level(level: PhraseyLogLevel) {
        switch (level) {
            case "success":
                return pico.green(`[success]`);

            case "info":
                return pico.cyan(`[info]`);

            case "warn":
                return pico.yellow(`[warn]`);

            case "error":
                return pico.red(`[error]`);
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
        });
        return log;
    }
}
