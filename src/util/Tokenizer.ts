import FileSystem from "./FileSystem";

export class TokenizerError extends Error {
    constructor(...args: any[]) {
        super(...args);
        Error.captureStackTrace(this, TokenizerError);
    }
}


export class Tokenizer {
    private tokenizerFile: string;
    private program: string;
    private tokens: string[][];
    private currentToken: {arr: number, pos: number};

    public static literals: {[id: string] : {val: string, isSpecial: boolean}} =
        Object.freeze({
        Program: {val: "program", isSpecial: false},
        Modules: {val: "modules", isSpecial: false},
        Dir: {val: "dir", isSpecial: false},
        Class: {val: "class", isSpecial: false},
        Interface: {val: "interface", isSpecial: false},
        Field: {val: "fields", isSpecial: false},
        Generate: {val: "generates", isSpecial: false},
        Function: {val: "function", isSpecial: false},
        Async: {val: "async", isSpecial: false},
        Static: {val: "static", isSpecial: false},
        Returns: {val: "returns", isSpecial: false},
        Params: {val: "params", isSpecial: false},
        Comments: {val: "comments", isSpecial: false},
        Abstract: {val: "abstract", isSpecial: false},
        Implements: {val: "implements", isSpecial: false},
        Extends: {val: "extends", isSpecial: false},
        Comma: {val: "\,", isSpecial: true},
        SquareBracketStart: {val: "\[", isSpecial: true},
        SquareBracketEnd: {val: "\]", isSpecial: true},
        Getters: {val: "getters", isSpecial: false},
        Setters: {val: "setters", isSpecial: false},
        Private: {val: "private", isSpecial: false},
        Public: {val: "public", isSpecial: false},
        Protected: {val: "protected", isSpecial: false},
        SingleQuote: {val: "\'", isSpecial: true},
        DoubleQuote: {val: "\"", isSpecial: true},
    });
    public static NO_MORE_TOKENS = "NO_MORE_TOKENS";
    private static reservedTokenWord = "_RESERVED_";


    constructor(fileName: string, path: string) {
        // initialize fields
        this.tokenizerFile =  `${path}/${fileName}`;
        this.tokens = [];
        this.currentToken = {arr: 0, pos: 0};
        // read contents of program
        let fileSystem = new FileSystem();
        // 1. read whole program to single string
        this.program = fileSystem.readFileSync(fileName, path).toString("utf8");
        // tokenize program
        this.tokenize();
    }

    /**
     * Tokenizes the program into array of array of strings.
     *
     * Each subarray represents a single line in the program, and starts with a token indicating
     * the line's indentation level.
     *
     * Preserves all spacing inside of quotations.
     *
     * TODO: handling array types
     */
    private tokenize() {
        // 2. kill new lines/ split program into subarrays for every nl
        let programLines: string[] = this.program.split("\n");

        programLines.forEach((line) => {
            // add token for indentation level of line
            line = "_INDENT_LEVEL=" + this.countTabs(line) + "_ " + line.trim();

            // split line on quotation marks, tokenize literals outside of quotations
            let splitLine = line.split(/("|')/g);
            let isInsideSingle = false, isInsideDouble = false;
            splitLine.forEach((substr, index) => {
                if (substr === "\'" && !isInsideDouble) {
                    if(!isInsideSingle) {
                        splitLine[index] = substr.replace(substr, Tokenizer.reservedTokenWord + substr
                            +Tokenizer.reservedTokenWord);
                    }
                    isInsideSingle = !isInsideSingle;
                }

                if(substr === "\"" && !isInsideSingle) {
                    if(!isInsideDouble) {
                        splitLine[index] = substr.replace(substr, Tokenizer.reservedTokenWord + substr
                            + Tokenizer.reservedTokenWord);
                    }
                    isInsideDouble = !isInsideDouble;
                }

                if(!(isInsideSingle || isInsideDouble)) {
                    // 3. replace all literals with reservedword<lit>reserverdword
                    for(let lit in Tokenizer.literals) {
                        let matchStr = Tokenizer.literals[lit].isSpecial ? "\\"+Tokenizer.literals[lit].val : Tokenizer.literals[lit].val;
                        let litMatcher = new RegExp(matchStr,'g');

                        substr = substr.replace(litMatcher, Tokenizer.reservedTokenWord
                            + Tokenizer.literals[lit].val + Tokenizer.reservedTokenWord);
                    }
                    // remove spaces
                    splitLine[index] = substr.replace(/ /g, Tokenizer.reservedTokenWord);
                }
            });
            line = splitLine.join("");
            // 4. replace all reservedwordreservedword with just reservedword
            line = line.replace("/("+ Tokenizer.reservedTokenWord + ")+/g", Tokenizer.reservedTokenWord);
            // 5. split on reservedword
            this.tokens.push(line.split(Tokenizer.reservedTokenWord).filter((str) => str !==''));
        });
        console.log(this.tokens);
    }

    /**
     * Counts the number of space characters at the beginning of string
     *
     * @param programLine   string representing a single line in the file program
     * @returns number      of space characters at the beginning of programLine
     */
    private countTabs(programLine: string): number {
        let count = 0;
        let index = 0;
        while(programLine.charAt(index) === " " || programLine.charAt(index) === "\t") {
            if(programLine.charAt(index) === "\t")  {
                count += 8;
            } else {
                count++;
            }
            index++;
        }
        return count;
    }

    public getNext(): string {
        let next = "";
        if (this.tokens.length > this.currentToken.arr
            && this.tokens[this.currentToken.arr].length > this.currentToken.pos) {

            next = this.tokens[this.currentToken.arr][this.currentToken.pos];

            if(this.tokens[this.currentToken.arr].length -1 == this.currentToken.pos) { //end of line
                this.currentToken.pos = 0;
                this.currentToken.arr++;
                this.goToNextNonBlankLine();
                if(this.tokens.length < this.currentToken.arr) {
                    next = Tokenizer.NO_MORE_TOKENS;
                }
            } else { // beginning/middle of line
                this.currentToken.pos++;
            }
            return next;
        }
        return Tokenizer.NO_MORE_TOKENS;
    }

    public checkToken(regexp: string): boolean {
        return RegExp(regexp).test(this.checkNext());
    }

    public getAndCheckNext(regexp: string): string {
        let next = this.getNext();
        if(!RegExp(regexp).test(next)) {
            throw new TokenizerError(next + " did not match regex value " + regexp);
        }
        return next;
    }

    private checkNext(): string {
        if (this.tokens.length -1 >= this.currentToken.arr
            && this.tokens[this.currentToken.arr].length -1 >= this.currentToken.pos) {
            return this.tokens[this.currentToken.arr][this.currentToken.pos];
        }
        return Tokenizer.NO_MORE_TOKENS;
    }

    public goToNextNonBlankLine() {
        while (this.currentToken.arr < this.tokens.length && this.isBlankLine()) {
            this.currentToken.arr++;
        }
    }

    private isBlankLine(): boolean {
        let currLine = this.tokens[this.currentToken.arr];
        // format blank line:  [ '_INDENT_LEVEL=[0-9]+_' ]
        return currLine.length == 1 && RegExp("_INDENT_LEVEL=").test(currLine[0]);
    }
}