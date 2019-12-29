import { expect } from "chai";
import {Tokenizer} from "../../src/util/Tokenizer";
import {VarList} from "../../src/ast/VarList";
import TypeCheckVisitor from "../../src/codegen/TypeCheckVisitor";

describe("VarList typecheck", () => {
    it("VarList typecheck handles collections", () => {
        const typeChecker: TypeCheckVisitor = new TypeCheckVisitor();
        let tokenizer: Tokenizer = new Tokenizer("varListWithCollections.txt", "./test/testFiles");
        let varList: VarList = new VarList();
        varList.parse(tokenizer);
        expect(varList.nameTypeMap.size).to.equal(3);
        varList.accept(typeChecker);
    });
});
