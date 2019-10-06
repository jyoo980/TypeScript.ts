import { expect } from "chai";
import {Tokenizer, TokenizerError} from "../../src/util/Tokenizer";

describe("Tokenizer makeInstance/getInstance/destroyInstance", () => {

    after(() => {
        Tokenizer.destroyInstance();
    });

    it("creates, gets and deletes Tokenizer instance successfully", () => {
        Tokenizer.makeInstance("projectstructureex.txt", "./test/testFiles");
        expect(() => {Tokenizer.getInstance()}).to.not.throw();
    });

    it("throws a TokenizerError when getting a Tokenizer instance before creation ", () => {
        expect(() => {Tokenizer.getInstance()}).to.throw(TokenizerError);
    });
});