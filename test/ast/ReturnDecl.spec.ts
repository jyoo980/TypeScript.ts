import {Tokenizer} from "../../src/util/Tokenizer";
import {expect} from "chai";
import ReturnDecl from "../../src/ast/ReturnDecl";
import TypeCheckVisitor from "../../src/codegen/TypeCheckVisitor";

describe("ReturnDecl typecheck", () => {
    it("ReturnDecl typecheck handles collections", () => {
        const typeChecker: TypeCheckVisitor = new TypeCheckVisitor();
        let tokenizer: Tokenizer = new Tokenizer("returnsWithCollection.txt", "./test/testFiles");
        let retDecl: ReturnDecl = new ReturnDecl();
        retDecl.parse(tokenizer);
        expect(retDecl.returnType).to.equal("number[]");
        retDecl.accept(typeChecker);
    });
});
