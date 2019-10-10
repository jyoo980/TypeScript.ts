import { expect } from "chai";
import {Tokenizer} from "../../src/util/Tokenizer";
import {ImplementsDecl} from "../../src/ast/ImplementsDecl";

describe("ImplementsDecl parse test", () => {
    it("parses single implements type line", () => {
        let tokenizer : Tokenizer = new Tokenizer("implementssingle.txt", "./test/testFiles");
        let implementsDec : ImplementsDecl = new ImplementsDecl();
        let parents = implementsDec.parse(tokenizer).parentNames;
        expect(parents.length).to.equal(1);
        expect(parents[0]).to.equal("Animal");
    });

    it("parses multi-implements type line", () => {
        let tokenizer : Tokenizer = new Tokenizer("implementsmultiple.txt", "./test/testFiles");
        let implementsDec : ImplementsDecl = new ImplementsDecl();
        let parents = implementsDec.parse(tokenizer).parentNames;
        expect(parents.length).to.equal(2);
        expect(parents[0]).to.equal("Transit");
        expect(parents[1]).to.equal("IStop");
    });
});