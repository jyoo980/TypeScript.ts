import { expect } from "chai";
import {Tokenizer} from "../../src/util/Tokenizer";
import {InterfaceDecl} from "../../src/ast/InterfaceDecl";
import {TypeTable} from "../../src/ast/symbols/TypeTable";
import {ValidationError} from "../../src/ast/errors/ASTErrors";

describe("InterfaceDecl parse test", () => {
    it("parses single-line, simple interface definition", () => {
        let typeTable : TypeTable = TypeTable.getInstance();
        expect(typeTable.table.size).to.equal(4);
        let tokenizer : Tokenizer = new Tokenizer("interfaceDeclSimple.txt", "./test/testFiles");
        let intDec : InterfaceDecl = new InterfaceDecl(".");
        intDec.parse(tokenizer);
        expect(intDec.interfaceName).to.equal("TransitLine");
        expect(intDec.comments).to.be.undefined;
        expect(intDec.extendsNodes.parentName).to.equal("Transit");
        expect(intDec.fieldDecl).to.be.undefined;
        expect(intDec.functions.length).to.equal(0);

        expect(typeTable.table.size).to.equal(5);
        expect(typeTable.getTypeNode(intDec.interfaceName)).to.not.be.undefined;

    });

    it("throws an error parsing invalid interface definition", () => {
        // TODO: implement this test case may require changes to how we tokenize... (does not currently throw error)
        let tokenizer : Tokenizer = new Tokenizer("interfaceSimpleInvalid.txt", "./test/testFiles");
        let intDec : InterfaceDecl = new InterfaceDecl(".");
        intDec.parse(tokenizer);
    });

    it("parses complex interface definition", () => {
        let tokenizer : Tokenizer = new Tokenizer("interfaceDeclComplex.txt", "./test/testFiles");
        let intDec : InterfaceDecl = new InterfaceDecl(".");
        intDec.parse(tokenizer);
        expect(intDec.interfaceName).to.equal("TransitLine");
        expect(intDec.comments).to.be.undefined;
        expect(intDec.fieldDecl).to.be.undefined;
        expect(intDec.functions.length).to.equal(2);
    });
});

    it("should correctly extend other interfaces", () => {
        let tokenizer: Tokenizer = new Tokenizer("interfaceDeclComplex.txt", "./test/testFiles");
        let parentDec: InterfaceDecl = new InterfaceDecl(".");
        parentDec.parse(tokenizer);
        tokenizer = new Tokenizer("interfaceDeclExtendsSimple.txt", "./test/testFiles");
        let childDec: InterfaceDecl = new InterfaceDecl(".");
        childDec.parse(tokenizer);
        childDec.fulfillContract();
        expect(childDec.comments).to.be.undefined;
        expect(childDec.fieldDecl).to.be.undefined;
        expect(childDec.functions.length).to.equal(2);

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
        let tokenizer: Tokenizer = new Tokenizer("interfaceDeclInvalidFieldMod.txt", "./test/testFiles");
        let intDec: InterfaceDecl = new InterfaceDecl(".");
        intDec.parse(tokenizer);
        expect(() => {
            intDec.typeCheck()
        }).to.throw(ValidationError);
    });

    it("successfully validates an interface declaration with private fields", () => {
        let tokenizer: Tokenizer = new Tokenizer("interfaceDeclWithFields.txt", "./test/testFiles");
        let intDec: InterfaceDecl = new InterfaceDecl(".");
        intDec.parse(tokenizer);
        expect(() => {
            intDec.typeCheck()
        }).to.not.throw(ValidationError);

    });

    it("successfully validates an interface declaration with no fields", () => {
        let tokenizer: Tokenizer = new Tokenizer("interfaceDeclComplex.txt", "./test/testFiles");
        let intDec: InterfaceDecl = new InterfaceDecl(".");
        intDec.parse(tokenizer);
        expect(() => {
            intDec.typeCheck()
        }).to.not.throw(ValidationError);

    });
    });
});
