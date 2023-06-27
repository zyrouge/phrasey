import pico from "picocolors";

export { pico };

export const log = {
    ln: () => console.log(),
    write: (text: string) => console.log(text),
    success: (text: string) => log.write(`${pico.green(`[success]`)} ${text}`),
    info: (text: string) => log.write(`${pico.green(`[info]`)} ${text}`),
    error: (text: string) => log.write(`${pico.red(`[error]`)} ${text}`),
    grayed: (text: string) => log.write(pico.gray(text)),
};
