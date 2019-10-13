import {ParseError, Tokenizer} from "../../src/util/Tokenizer";
import {ModuleDecl} from "../../src/ast/ModuleDecl";
import {expect} from "chai";
import * as fs from 'fs';
import * as nodeFs from "fs-extra";

describe("ModuleDecl parse() test", () => {

    let moduleDecl: ModuleDecl;

    beforeEach(() => {
        moduleDecl = new ModuleDecl();
    });

    afterEach(() => {
        moduleDecl = null;
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
            expect(result).to.equal('NO_MORE_TOKENS is an invalid token in line 2');
        }
    });
});

describe('ModuleDecl evaluate() test', () => {
    let moduleDecl: ModuleDecl;
    const dir: string = 'packageModulesTest';

    before(() => {	
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    });

    beforeEach(() => {
        moduleDecl = new ModuleDecl();
    });

    afterEach(() => {
        moduleDecl = null;
        nodeFs.removeSync(dir);
    });

    function readPackageJson(path: string): any {
        return JSON.parse(fs.readFileSync(path + '/package.json', 'utf-8'));
    }

    it('should add a package.json file at ./packageTest with "project1" as project name', async () => {
        moduleDecl.setPath(dir);
        moduleDecl.setProjectName('project1');
        await moduleDecl.evaluate();
        expect(fs.existsSync(dir + '/package.json')).to.be.true;
        const packageContents: any = readPackageJson(dir);
        expect(packageContents.name).to.equal('project1');
    });
});