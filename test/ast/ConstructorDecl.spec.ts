import { expect } from "chai";
import {Tokenizer} from "../../src/util/Tokenizer";
import ConstructorDecl from "../../src/ast/ConstructorDecl";

describe("ConstructorDecl parse test", () => {

    let constructor: ConstructorDecl;

    beforeEach(() => {
        constructor = new ConstructorDecl();
    });

    it ("should parse a constructor with no params", () => {
        const tokenizer: Tokenizer = new Tokenizer("constructorNoParams.txt", "./test/testFiles");
        constructor.parse(tokenizer);
        expect(constructor.modifier).to.equal("public");
        expect(constructor.params.nameTypeMap.size).to.equal(0);
    });

    it ("should parse a constructor with params", () => {
        const tokenizer: Tokenizer = new Tokenizer("constructorWithParams.txt", "./test/testFiles");
        constructor.parse(tokenizer);
        expect(constructor.modifier).to.equal("private");
        expect(constructor.params.nameTypeMap.get("facade")).to.equal("IInsightFacade");
        expect(constructor.params.nameTypeMap.get("engine")).to.equal("QueryEngine");
    });

});
