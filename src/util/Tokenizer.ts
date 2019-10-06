import FileSystem from "./FileSystem";

export class TokenizerError extends Error {
    constructor(...args: any[]) {
        super(...args);
        Error.captureStackTrace(this, TokenizerError);
    }
}

export class Tokenizer {
    private static tokenizerInstance: Tokenizer;
    private static tokenizerFile: string;
    private static program: string;
    private static tokens: string[][];
    private currentToken: {arr: number, pos: number};

    private constructor(fileName: string, path: string) {
        // initialize fields
        Tokenizer.tokenizerFile =  `${path}/${fileName}`;
        Tokenizer.tokens = [];
        this.currentToken = {arr: 0, pos: 0};
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
        // TODO: add ALL valid tokens here.
        let literals = [",", "\"", "\'", " ", "implements"];
        // split program into subarrays for every nl
        let programLines: string[] = Tokenizer.program.split("\n");

        const reservedTokenWord = "_RESERVED_";

        programLines.forEach((line) => {
            // add token for indentation level of line, and remove whitespace at end of line.
            line = "_INDENT_LEVEL=" + this.countTabs(line) + "_ " + line.trim();

            // keeps track of whether we are inside quotation marks
            let isSingleQuote = false;
            let isDoubleQuote = false;

            let splitLine = Array.from(line);
            splitLine.forEach((str, index) => {
                if(str === "\'") {
                    splitLine[index] = "REPLACE QUOTE"

                }
                if(str === "\"") {
                    splitLine[index] = "REPLACE DOUBLE QUOTE"
                }
            });

            // create array from the string.
            // if we are in a quote, do not add a quote (one of the quotes = true
            // once we hit another quote of same kind, exit the skipping of any tokenizing.
            // if both are false, then we can continue to tokenize the things we want to tokenize.
            // split on the token.


            // Tokenizer.literals.forEach((lit) => {
            //     let litReg = new RegExp(lit, 'g');
            //     line = line.replace(litReg, reservedTokenWord + lit + reservedTokenWord);
            // });

            // TODO: have to better handle this for case where we have strings for comments
            // line = line.replace(/[ ]+/g, " ");
            // Tokenizer.tokens.push(line.split(" "));
            Tokenizer.tokens.push(splitLine);
        });
        console.log(Tokenizer.tokens);
    }

    /**
     * Counts the number of space characters at the beginning of string
     *
     * @param programLine   string representing a single line in the file program
     * @returns number      of space characters at the beginning of programLine
     */
    private countTabs(programLine: string): number {
        let index = 0;
        while(programLine.charAt(index) === " ") {
            index++;
        }
        return index;
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