import { expect } from "chai";
import {ExtendsDecl} from "../../src/ast/ExtendsDecl";
import {Tokenizer} from "../../src/util/Tokenizer";

describe("ExtendsDecl parse test", () => {
    it("parses extends type line", () => {
        let tokenizer : Tokenizer = new Tokenizer("extends.txt", "./test/testFiles");
        let extendsDec : ExtendsDecl = new ExtendsDecl();
        expect(extendsDec.parse(tokenizer).parentName).to.equal("Animal");
    });

});