import { ZodError } from "zod";
import { PhraseyTreeLike } from "./utils";

export class PhraseyError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }

    toString() {
        return `PhraseyError: ${this.message}`;
    }

    // static constructTreeLikeString(error: any) {
    //     if (error instanceof PhraseyWrappedError) {
    //         return PhraseyTreeLike.build([
    //             `PhraseyWrappedError: ${error.message}\n${
    //                 error.stack ?? ""
    //             }`.trim(),
    //             PhraseyError.constructTreeLikeString(error.error),
    //         ]);
    //     }
    //     if (error instanceof Error) {
    //         return PhraseyTreeLike.build(
    //             `${error}\n${error.stack ?? ""}`.trim(),
    //         );
    //     }
    //     return PhraseyTreeLike.build(`${error}`);
    // }
}

export class PhraseyValidationError extends Error {
    constructor(
        message: string,
        public zodError: ZodError,
    ) {
        super(message);
    }

    toString() {
        return `PhraseyValidationError: ${this.message}\n${this.formattedErrors}`;
    }

    get formattedErrors() {
        return PhraseyTreeLike.build(this.zodError.errors, {
            map: (x) => `Invalid field "${x.path.join(".")}" (${x.message})`,
        });
    }
}
