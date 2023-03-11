export class PhraseyError extends Error {
    constructor(message: string) {
        super(message);
    }

    toString() {
        return `PhraseySchemaError: ${this.message}`;
    }
}
