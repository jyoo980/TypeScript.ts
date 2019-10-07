import { expect } from "chai";
import {Tokenizer, TokenizerError} from "../../src/util/Tokenizer";

describe("Tokenizer tokenize", () => {
    it("gets and checks tokens in projectstructureex", () => {
        let tokenizer: Tokenizer = new Tokenizer("projectstructureex.txt", "./test/testFiles");
        //dir src
        expect(tokenizer.getCurrentLineTabLevel()).to.equal(0);
        expect(tokenizer.getNext()).to.equal("dir");
        expect(tokenizer.getNext()).to.equal("src");
        // 	class Time
        expect(tokenizer.getCurrentLineTabLevel()).to.equal(8);
        expect(tokenizer.getAndCheckNext("class")).to.equal("class");
        expect(tokenizer.getNext()).to.equal("Time");
        //	dir TransitModels
        expect(tokenizer.getCurrentLineTabLevel()).to.equal(8);
        expect(tokenizer.getAndCheckNext(Tokenizer.literals.Dir.val)).to.equal("dir");
        expect(tokenizer.getNext()).to.equal("TransitModels");
        // dir tests
        expect(tokenizer.getCurrentLineTabLevel()).to.equal(0);
        expect(tokenizer.getNext()).to.equal("dir");
        expect(tokenizer.getNext()).to.equal("tests");
        // blank line, goto dir util
        expect(tokenizer.getCurrentLineTabLevel()).to.equal(0);
        expect(tokenizer.getNext()).to.equal("dir");
        expect(tokenizer.checkToken("util")).to.equal(true);
        expect(tokenizer.getNext()).to.equal("util");
        // blank line
        expect(tokenizer.getCurrentLineTabLevel()).to.equal(8);
        expect(tokenizer.getNext()).to.equal("dir");
        // end of file
        expect(tokenizer.checkToken(Tokenizer.NO_MORE_TOKENS)).to.equal(true);
        expect(tokenizer.getCurrentLineTabLevel()).to.equal(0);
    });

    it("gets and checks tokens from transitFnExample", () => {
        let tokenizer: Tokenizer = new Tokenizer("transitFnExample.txt", "./test/testFiles");
        // class Line implements TransitLine
        expect(tokenizer.getNext()).to.equal("class");
        expect(tokenizer.getNext()).to.equal("Line");
        expect(tokenizer.getNext()).to.equal("implements");
        expect(tokenizer.getNext()).to.equal("TransitLine");
        // 	fields private [string name, string lineNumber, Stop stop]
        expect(tokenizer.getAndCheckNext("fields")).to.equal("fields");
        expect(tokenizer.getNext()).to.equal("private");
        expect(tokenizer.getNext()).to.equal("[");
        expect(tokenizer.getNext()).to.equal("string");
        expect(tokenizer.getNext()).to.equal("name");
        expect(tokenizer.getNext()).to.equal(",");
        expect(tokenizer.getNext()).to.equal("string");
        expect(tokenizer.getNext()).to.equal("lineNumber");
        expect(tokenizer.getNext()).to.equal(",");
        expect(tokenizer.getNext()).to.equal("Stop");
        expect(tokenizer.getNext()).to.equal("stop");
    });
});