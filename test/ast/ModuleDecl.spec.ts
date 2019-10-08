import {ParseError, Tokenizer} from "../../src/util/Tokenizer";
import {ModuleDecl} from "../../src/ast/ModuleDecl";
import {expect} from "chai";

describe("FieldDecl tokenizer test", () => {

    let moduleDecl: ModuleDecl;

    before(() => {
        moduleDecl = new ModuleDecl();
    });

    it('should parse modules ["someModule1", "someModule2: 1.0.0"]', () => {
        const tokenizer: Tokenizer = new Tokenizer("moduleDeclExample.txt", "./test/testFiles");
        moduleDecl.parse(tokenizer);
        expect(moduleDecl.modules).to.deep.equal(['someModule1', 'someModule2: 1.0.0']);
    });
    
    it('should parse modules []', () => {
        const tokenizer: Tokenizer = new Tokenizer("moduleDeclEmpty.txt", "./test/testFiles");
        moduleDecl.parse(tokenizer);
        expect(moduleDecl.modules).to.deep.equal([]);
    });

    it('should parse multiline modules ["someModule1", "someModule2"]', () => {
        const tokenizer: Tokenizer = new Tokenizer("moduleDeclMultiline.txt", "./test/testFiles");
        moduleDecl.parse(tokenizer);
        expect(moduleDecl.modules).to.deep.equal(['someModule1', 'someModule2']);
    });

    it('should parse multiline modules ["someModule1", "someModule2"]', () => {
        const tokenizer: Tokenizer = new Tokenizer("moduleDeclBadIndent.txt", "./test/testFiles");
        let result: string;
        try {
            moduleDecl.parse(tokenizer);
        } catch (e) {
            result = e.message;
        } finally {
            expect(result).to.equal('Bad indent');
        }
    });

    it('should parse multiline modules ["someModule1", "someModule2"]', () => {
        const tokenizer: Tokenizer = new Tokenizer("moduleDeclNotValid.txt", "./test/testFiles");
        let result: string;
        try {
            moduleDecl.parse(tokenizer);
        } catch (e) {
            result = e.message;
        } finally {
            expect(result).to.equal('NO_MORE_TOKENS did not match regex value "');
        }
    });
});
