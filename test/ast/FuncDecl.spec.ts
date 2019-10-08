import { expect } from "chai";
import FuncDecl from "../../src/ast/FuncDecl";
import {Tokenizer} from "../../src/util/Tokenizer";

describe("FuncDecl parse tests", () => {

    let funcDecl: FuncDecl;

    before(() => {
        funcDecl = new FuncDecl();
    });

    it("should parse a simple function declaration (no params)", () => {
        // private foo(): number;
        const tokenizer: Tokenizer = new Tokenizer("funcDeclSimple.txt", "./test/testFiles");
        funcDecl.parse(tokenizer);
        expect(funcDecl.modifier).to.equal("private");
        expect(funcDecl.name).to.equal("foo");
        expect(funcDecl.params.nameToType.size).to.equal(0);
        expect(funcDecl.isAsync).to.equal(false);
        expect(funcDecl.isStatic).to.equal(false);
        expect(funcDecl.comment).to.equal(null);
        expect(funcDecl.returnType).to.equal("number");
    });

    it("should parse a parameterized function declaration", () => {
        // public bar(facade: InsightFacade, foo: number): void;
        const tokenizer: Tokenizer = new Tokenizer("funcDeclParameterized.txt", "./test/testFiles");
        funcDecl.parse(tokenizer);
        expect(funcDecl.modifier).to.equal("public");
        expect(funcDecl.name).to.equal("bar");
        expect(funcDecl.params.nameToType.size).to.equal(2);
        expect(funcDecl.isAsync).to.equal(false);
        expect(funcDecl.isStatic).to.equal(false);
        expect(funcDecl.comment).to.equal(null);
        expect(funcDecl.returnType).to.equal("void");
    });

    it("should parse a function declaration with comments", () => {
        const tokenizer: Tokenizer = new Tokenizer("funcDeclWithComments.txt", "./test/testFiles");
        funcDecl.parse(tokenizer);
        expect(funcDecl.modifier).to.equal("private");
        expect(funcDecl.name).to.equal("foo");
        expect(funcDecl.params.nameToType.size).to.equal(0);
        expect(funcDecl.isAsync).to.equal(false);
        expect(funcDecl.isStatic).to.equal(false);
        expect(funcDecl.comment.comments).to.deep.equal(["ayy lmao"]);
        expect(funcDecl.returnType).to.equal("number");
    });

});
