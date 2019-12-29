import {Tokenizer} from "../../src/util/Tokenizer";
import {ProgramDecl} from "../../src/ast/ProgramDecl";
import TypeCheckVisitor from "../../src/codegen/TypeCheckVisitor";

describe("Top-level TypeScript DSL tests", () => {

    const typeChecker: TypeCheckVisitor = new TypeCheckVisitor();

    it("Should evaluate the simplest program", () => {
        const tokenizer: Tokenizer = new Tokenizer("simpleProgram.txt", "./test/testFiles");
        let programDecl: ProgramDecl = new ProgramDecl(".");
        programDecl.parse(tokenizer);
        programDecl.accept(typeChecker);
        programDecl.evaluate();
    });

    it("Should evaluate a program with a class", () => {
        const tokenizer: Tokenizer = new Tokenizer("simpleProgramClass.txt", "./test/testFiles");
        let programDecl: ProgramDecl = new ProgramDecl(".");
        programDecl.parse(tokenizer);
        programDecl.accept(typeChecker);
        programDecl.evaluate();
    });
});
