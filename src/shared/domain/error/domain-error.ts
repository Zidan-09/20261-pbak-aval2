export class DomainError extends Error {
    constructor(
        private readonly code: string, 
        message: string
    ) {
        super(message);
    }

    public getCode() {
        return this.code;
    }

    public getMessage() {
        return this.message;
    }
}