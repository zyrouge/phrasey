import { ZodError } from "zod";
import { PhraseyTreeLike } from "./utils";

export class PhraseyError extends Error {
    constructor(message: string) {
        super(message);
    }

    toString() {
        return `PhraseyError: ${this.message}`;
    }
}

export class PhraseyValidationError extends Error {
    constructor(message: string, public zodError: ZodError) {
        super(message);
    }

    toString() {
        return `PhraseyValidationError: ${this.message}\n${this.formattedErrors}`;
    }

    get formattedErrors() {
        return PhraseyTreeLike.build(this.zodError.errors, {
            map: (x) => `Invalid field "${x.path}" (${x.message})`,
        });
    }
}

export class PhraseyWrappedError extends Error {
    constructor(message: string, public error: unknown) {
        super(message);
    }

    toString() {
        return `PhraseyWrappedError: ${this.message}\n${this.formattedError}`;
    }

    get formattedError() {
        return PhraseyTreeLike.build([`${this.error}`]);
    }
}
