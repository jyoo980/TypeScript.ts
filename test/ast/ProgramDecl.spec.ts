import {Tokenizer} from "../../src/util/Tokenizer";
import {expect} from "chai";
import {ProgramDecl} from "../../src/ast/ProgramDecl";

describe("Top-level TypeScript DSL tests", () => {

    it("Should evaluate the simplest program", () => {
        const tokenizer: Tokenizer = new Tokenizer("simpleProgram.txt", "./test/testFiles");
        let programDecl: ProgramDecl = new ProgramDecl(".");
        programDecl.parse(tokenizer);
        programDecl.typeCheck();
        programDecl.evaluate();
    });

    it("Should evaluate a program with a class", () => {
        const tokenizer: Tokenizer = new Tokenizer("simpleProgramClass.txt", "./test/testFiles");
        let programDecl: ProgramDecl = new ProgramDecl(".");
        programDecl.parse(tokenizer);
        programDecl.typeCheck();
        programDecl.evaluate();
    });
});
