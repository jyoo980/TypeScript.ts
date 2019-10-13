export class ValidationError extends Error {
    constructor(...args: any[]) {
        super(...args);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
