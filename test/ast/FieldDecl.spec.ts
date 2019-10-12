import {ParseError, Tokenizer} from "../../src/util/Tokenizer";
import {FieldDecl} from "../../src/ast/FieldDecl";
import {expect} from "chai";
import {TypeCheckError} from "../../src/ast/symbols/TypeTable";

describe("FieldDecl tokenizer test", () => {

    let fieldDecl: FieldDecl;

    before(() => {
        fieldDecl = new FieldDecl();
    });

    it("should parse a field declaration with just fields - fields private [string foo, IInsightFacade facade]", () => {
        const tokenizer: Tokenizer = new Tokenizer("fieldDeclExample.txt", "./test/testFiles");
        fieldDecl.parse(tokenizer);
        expect(fieldDecl.modifier).to.equal("private");
        expect(fieldDecl.fields.nameTypeMap.get("foo")).to.deep.equal("string");
    });

    it("should parse a field declaration with getters", () => {
        const tokenizer: Tokenizer = new Tokenizer("fieldDeclWithGetter.txt", "./test/testFiles");
        fieldDecl.parse(tokenizer);
        expect(fieldDecl.modifier).to.equal("private");
        expect(fieldDecl.fields.nameTypeMap.get("foo")).to.deep.equal("string");
        expect(fieldDecl.fields.nameTypeMap.get("facade")).to.deep.equal("IInsightFacade");
        expect(fieldDecl.generateGetter).to.equal(true);
        expect(fieldDecl.generateSetter).to.equal(false);
    });

    it("should parse a field declaration with getters/setters", () => {
        const tokenizer: Tokenizer = new Tokenizer("fieldDeclWithGetterSetter.txt", "./test/testFiles");
        fieldDecl.parse(tokenizer);
        expect(fieldDecl.modifier).to.equal("private");
        expect(fieldDecl.fields.nameTypeMap.get("foo")).to.deep.equal("string");
        expect(fieldDecl.fields.nameTypeMap.get("facade")).to.deep.equal("IInsightFacade");
        expect(fieldDecl.generateGetter).to.equal(true);
        expect(fieldDecl.generateSetter).to.equal(true);
    });

    it ("should throw a ParseError if it fails to parse a getter/setter", () => {
        const tokenizer: Tokenizer = new Tokenizer("fieldDeclNotValid.txt", "./test/testFiles");
        expect(() => {
            fieldDecl.parse(tokenizer);
        }).to.throw(ParseError)
    });

    it("should throw a TypeCheckError when it contains types which are undeclared", () => {
        const tokenizer: Tokenizer = new Tokenizer("fieldDeclExample.txt", "./test/testFiles");
        fieldDecl.parse(tokenizer);
        expect(() => {
            return fieldDecl.typeCheck();
        }).to.throw(TypeCheckError);
    });
});
