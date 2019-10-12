export class ValidationError extends Error {
    constructor(...args: any[]) {
        super(...args);
        Error.captureStackTrace(this, ValidationError);
    }
}