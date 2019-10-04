export class Tokenizer {
    private static tokenizerInstance: Tokenizer;
    private tokens: string[];

    private constructor(fileName: string) {
        // TODO: implement this
    }

    public static makeInstance(fileName: string) {
        if(!this.tokenizerInstance) {
            this.tokenizerInstance = new Tokenizer(fileName);
        }
    }

    public static getInstance(): Tokenizer {
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