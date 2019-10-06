export class TokenizerError extends Error {
    constructor(...args: any[]) {
        super(...args);
        Error.captureStackTrace(this, TokenizerError);
    }
}

export class Tokenizer {
    private static tokenizerInstance: Tokenizer;
    private static tokenizerFile: string;
    private tokens: string[];

    private constructor(fileName: string) {
        Tokenizer.tokenizerFile =  fileName;
        // TODO: implement this
    }

    public static makeInstance(fileName: string) {
        if(!this.tokenizerInstance) {
            this.tokenizerInstance = new Tokenizer(fileName);
        } else {
            const msg = `Called makeInstance with ${fileName},but already initialized with ${this.tokenizerFile}`;
            console.warn(msg);
        }
    }

    public static getInstance(): Tokenizer {
        if(!this.tokenizerInstance) {
            const msg = `Must initialize Tokenizer with Tokenizer::makeInstance before calling Tokenizer::getInstance`;
            console.warn(msg);
            throw new TokenizerError(msg);
        }
        return this.tokenizerInstance;
    }

    private tokenize() {
        // TODO: implement this
    }

    public getNext(): string {
        // TODO: implement this
        return "";
    }

    public checkToken(regexp: string): boolean {
        // TODO: implement this
        return false;
    }

    public getAndCheckNext(regexp: string): string {
        // TODO: implement this
        return "";
    }

    private checkNext(): string {
        // TODO: implement this
        return "";

    }
}