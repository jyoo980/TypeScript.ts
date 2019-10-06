import FileSystem from "./FileSystem";

export class TokenizerError extends Error {
    constructor(...args: any[]) {
        super(...args);
        Error.captureStackTrace(this, TokenizerError);
    }
}

// TODO: add all of the valid literals here.
export enum TokenLiterals {
    Class = "class",
    Interface = "interface",
    Implements = "implements",
    Extends = "extends"
}

export class Tokenizer {
    private static tokenizerInstance: Tokenizer;
    private static tokenizerFile: string;
    private static program: string;
    private tokens: string[][];
    private currentToken: {arr: number, pos: number};

    private constructor(fileName: string, path: string) {
        Tokenizer.tokenizerFile =  `${path}/${fileName}`;
        // read contents of program
        let fileSystem = new FileSystem();
        Tokenizer.program = fileSystem.readFileSync(fileName, path).toString("utf8");
        // tokenize program
        this.tokenize();
    }

    /**
     * Creates an instance of Tokenizer and tokenizes contents of fileName
     *
     * @param fileName      of the file to be read and tokenized
     * @returns Tokenizer   a Tokenizer with the tokenized contents of fileName
     */
    public static makeInstance(fileName: string, path: string) {
        if(!this.tokenizerInstance) {
            this.tokenizerInstance = new Tokenizer(fileName, path);
        } else {
            const msg = `Called makeInstance with ${fileName},but already initialized with ${this.tokenizerFile}`;
            console.warn(msg);
        }
    }

    /**
     * Gets the instance of Tokenizer, throws a TokenizerError if no Tokenizer instance exists
     *
     * @returns Tokenizer   the instantiated Tokenizer
     */
    public static getInstance(): Tokenizer {
        if(!this.tokenizerInstance) {
            const msg = `Must initialize Tokenizer with Tokenizer::makeInstance before calling Tokenizer::getInstance`;
            console.warn(msg);
            throw new TokenizerError(msg);
        }
        return this.tokenizerInstance;
    }

    /**
     * Destroys the Tokenizer instance
     */
    public static destroyInstance() {
        this.tokenizerInstance = undefined;
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