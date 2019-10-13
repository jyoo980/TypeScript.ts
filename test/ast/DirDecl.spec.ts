import { expect } from "chai";
import {DirDecl} from "../../src/ast/DirDecl";
import {Tokenizer} from "../../src/util/Tokenizer";
import {ClassDecl} from "../../src/ast/ClassDecl";

describe("DirDecl parse test", () => {

    const DUMMY_ROOT_DIR: string = ".";

    it("parses dir with abstract class inside", () => {
        let tokenizer : Tokenizer = new Tokenizer("dirDeclWithAbstractClass.txt", "./test/testFiles");
        let dirDec : DirDecl = new DirDecl(DUMMY_ROOT_DIR);
        dirDec.parse(tokenizer);
        expect(dirDec.contents).to.have.length(1);
        let classDec = dirDec.contents[0] as ClassDecl;
        expect(classDec.isAbstract).to.be.true;
    });
});