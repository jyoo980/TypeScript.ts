import { expect } from "chai";
import {ParseError, Tokenizer} from "../../src/util/Tokenizer";
import {InterfaceDecl} from "../../src/ast/InterfaceDecl";
import {TypeTable} from "../../src/ast/symbols/TypeTable";
import {ValidationError} from "../../src/ast/errors/ASTErrors";

describe("InterfaceDecl parse test", () => {
    it("parses single-line, simple interface definition", () => {
        let typeTable : TypeTable = TypeTable.getInstance();
        expect(typeTable.table.size).to.equal(4);
        let tokenizer : Tokenizer = new Tokenizer("interfaceDeclSimple.txt", "./test/testFiles");
        let intDec : InterfaceDecl = new InterfaceDecl(".");
        intDec = intDec.parse(tokenizer);
        expect(intDec.interfaceName).to.equal("TransitLine");
        expect(intDec.comments).to.be.undefined;
        expect(intDec.extendsNodes.parentName).to.equal("Transit");
        expect(intDec.fieldDecl).to.be.undefined;
        expect(intDec.functions.length).to.equal(0);

        expect(typeTable.table.size).to.equal(5);
        expect(typeTable.getTypeNode(intDec.interfaceName)).to.not.be.undefined;

    });

    it("throws an error parsing invalid interface definition", () => {
        let tokenizer : Tokenizer = new Tokenizer("interfaceSimpleInvalid.txt", "./test/testFiles");
        let intDec : InterfaceDecl = new InterfaceDecl(".");
        expect(() => {intDec.parse(tokenizer)}).to.throw(ParseError);
    });

    it("parses complex interface definition", () => {
        let tokenizer : Tokenizer = new Tokenizer("interfaceDeclComplex.txt", "./test/testFiles");
        let intDec : InterfaceDecl = new InterfaceDecl(".");
        intDec = intDec.parse(tokenizer);
        expect(intDec.interfaceName).to.equal("TransitLine");
        expect(intDec.comments).to.be.undefined;
        expect(intDec.fieldDecl).to.be.undefined;
        expect(intDec.functions.length).to.equal(2);
    });

    it("throws a ParseError with invalid line", () => {
        let tokenizer : Tokenizer = new Tokenizer("interfaceInvalidInput.txt", "./test/testFiles");
        let intDec : InterfaceDecl = new InterfaceDecl(".");
        expect(() => {intDec.parse(tokenizer)}).to.throw(ParseError);

    });
});

describe("InterfaceDecl evaluate test", () => {
    it("should write a complex interface definition to disk", () => {
        let tokenizer : Tokenizer = new Tokenizer("interfaceDeclComplex.txt", "./test/testFiles");
        let intDec : InterfaceDecl = new InterfaceDecl("./codegen/test");
        intDec.parse(tokenizer);
        intDec.evaluate();
    });
});

describe("InterfaceDecl typeCheck test", () => {
    it("throws a validation error when the modifier for an interface is not public", () => {
        let tokenizer : Tokenizer = new Tokenizer("interfaceDeclInvalidFieldMod.txt", "./test/testFiles");
        let intDec : InterfaceDecl = new InterfaceDecl(".");
        intDec.parse(tokenizer);
        expect(() => {intDec.typeCheck()}).to.throw(ValidationError);
    });

    it("successfully validates an interface declaration with private fields", () => {
        let tokenizer : Tokenizer = new Tokenizer("interfaceDeclWithFields.txt", "./test/testFiles");
        let intDec : InterfaceDecl = new InterfaceDecl(".");
        intDec.parse(tokenizer);
        expect(() => {intDec.typeCheck()}).to.not.throw(ValidationError);

    });

    it("successfully validates an interface declaration with no fields", () => {
        let tokenizer : Tokenizer = new Tokenizer("interfaceDeclComplex.txt", "./test/testFiles");
        let intDec : InterfaceDecl = new InterfaceDecl(".");
        intDec.parse(tokenizer);
        expect(() => {intDec.typeCheck()}).to.not.throw(ValidationError);

    });

});
