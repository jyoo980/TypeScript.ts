import {Tokenizer} from "../../src/util/Tokenizer";
import {FieldDecl} from "../../src/ast/FieldDecl";
import {expect} from "chai";

describe("FieldDecl tokenizer test", () => {

    let fieldDecl: FieldDecl;

    before(() => {
        fieldDecl = new FieldDecl();
    });

    it("should parse a field declaration with just fields - fields private [string foo, IInsightFacade facade]", () => {
        const tokenizer: Tokenizer = new Tokenizer("fieldDeclExample.txt", "./test/testFiles");
        fieldDecl.parse(tokenizer);
        expect(fieldDecl.modifier).to.equal("private");
        expect(fieldDecl.fields.nameToType.get("foo")).to.deep.equal("string");
    });

    it("should parse a field declaration with a getter", () => {
        const tokenizer: Tokenizer = new Tokenizer("fieldDeclWithGetter.txt", "./test/testFiles");
        fieldDecl.parse(tokenizer);
        expect(fieldDecl.modifier).to.equal("private");
        expect(fieldDecl.fields.nameToType.get("foo")).to.deep.equal("string");
        expect(fieldDecl.fields.nameToType.get("facade")).to.deep.equal("IInsightFacade");
        expect(fieldDecl.generateGetter).to.equal(true);
        expect(fieldDecl.generateSetter).to.equal(false);
    });

    it("should parse a field declaration with a getter/setter", () => {
        const tokenizer: Tokenizer = new Tokenizer("fieldDeclWithGetterSetter.txt", "./test/testFiles");
        fieldDecl.parse(tokenizer);
        expect(fieldDecl.modifier).to.equal("private");
        expect(fieldDecl.fields.nameToType.get("foo")).to.deep.equal("string");
        expect(fieldDecl.fields.nameToType.get("facade")).to.deep.equal("IInsightFacade");
        expect(fieldDecl.generateGetter).to.equal(true);
        expect(fieldDecl.generateSetter).to.equal(true);
    });
});
