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
        expect(funcDecl.maybeAsync.isAsync).to.equal(false);
        expect(funcDecl.maybeStatic.isStatic).to.equal(false);
        expect(funcDecl.comment.comments).to.deep.equal([]);
        expect(funcDecl.returnDecl.returnType).to.equal("number");
    });

    it("should parse a parameterized function declaration", () => {
        // public bar(facade: InsightFacade, foo: number): void;
        const tokenizer: Tokenizer = new Tokenizer("funcDeclParameterized.txt", "./test/testFiles");
        funcDecl.parse(tokenizer);
        expect(funcDecl.modifier).to.equal("public");
        expect(funcDecl.name).to.equal("bar");
        expect(funcDecl.params.nameToType.size).to.equal(2);
        expect(funcDecl.maybeAsync.isAsync).to.equal(false);
        expect(funcDecl.maybeStatic.isStatic).to.equal(false);
        expect(funcDecl.comment.comments).to.deep.equal([]);
        expect(funcDecl.returnDecl.returnType).to.equal("void");
    });

    it("should parse a function declaration with comments", () => {
        const tokenizer: Tokenizer = new Tokenizer("funcDeclWithComments.txt", "./test/testFiles");
        funcDecl.parse(tokenizer);
        expect(funcDecl.modifier).to.equal("private");
        expect(funcDecl.name).to.equal("foo");
        expect(funcDecl.params.nameToType.size).to.equal(0);
        expect(funcDecl.maybeAsync.isAsync).to.equal(false);
        expect(funcDecl.maybeStatic.isStatic).to.equal(false);
        expect(funcDecl.comment.comments).to.deep.equal(["ayy lmao"]);
        expect(funcDecl.returnDecl.returnType).to.equal("number");
    });

    it("should parse a function declaration with modifier async", () => {
        const tokenizer: Tokenizer = new Tokenizer("funcDeclWithModifier.txt", "./test/testFiles");
        funcDecl.parse(tokenizer);
        expect(funcDecl.modifier).to.equal("public");
        expect(funcDecl.name).to.equal("bar");
        expect(funcDecl.params.nameToType.size).to.equal(2);
        expect(funcDecl.maybeAsync.isAsync).to.equal(true);
        expect(funcDecl.maybeStatic.isStatic).to.equal(false);
        expect(funcDecl.comment.comments).to.deep.equal([]);
        expect(funcDecl.returnDecl.returnType).to.equal("void");
    });

    it("should parse a function declaration with modifier static async", () => {
        const tokenizer: Tokenizer = new Tokenizer("funcDeclStaticAsync.txt", "./test/testFiles");
        funcDecl.parse(tokenizer);
        expect(funcDecl.modifier).to.equal("public");
        expect(funcDecl.name).to.equal("bar");
        expect(funcDecl.params.nameToType.size).to.equal(2);
        expect(funcDecl.maybeAsync.isAsync).to.equal(true);
        expect(funcDecl.maybeStatic.isStatic).to.equal(true);
        expect(funcDecl.comment.comments).to.deep.equal([]);
        expect(funcDecl.returnDecl.returnType).to.equal("void");
    });

    it("should parse a complex function declaration", () => {
        const tokenizer: Tokenizer = new Tokenizer("funcDeclComplex.txt", "./test/testFiles");
        funcDecl.parse(tokenizer);
        expect(funcDecl.modifier).to.equal("public");
        expect(funcDecl.name).to.equal("addDataset");
        expect(funcDecl.params.nameToType.size).to.equal(3);
        expect(funcDecl.maybeAsync.isAsync).to.equal(true);
        expect(funcDecl.maybeStatic.isStatic).to.equal(true);
        expect(funcDecl.comment.comments).to.deep.equal(["Add Dataset function", "returns ids of datasets on disk"]);
        expect(funcDecl.returnDecl.returnType).to.equal(`Promise<string>`);
    });
});
