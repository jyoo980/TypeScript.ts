import {Tokenizer} from "../../src/util/Tokenizer";
import {expect} from "chai";
import ReturnDecl from "../../src/ast/ReturnDecl";

describe("ReturnDecl typecheck", () => {
    it("ReturnDecl typecheck handles collections", () => {
        let tokenizer: Tokenizer = new Tokenizer("returnsWithCollection.txt", "./test/testFiles");
        let retDecl: ReturnDecl = new ReturnDecl();
        retDecl.parse(tokenizer);

        expect(retDecl.returnType).to.equal("number[]");
        retDecl.typeCheck();
    });
});