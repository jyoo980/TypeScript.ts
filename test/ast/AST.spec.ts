import { expect } from "chai";
import {Tokenizer} from "../../src/util/Tokenizer";
import {ProgramDecl} from "../../src/ast/ProgramDecl";

describe("ProgramDecl should have its appropriate contents", () => {
    it("Tokenizes projectstructureex and parses inside ProgramDecl", () => {
        let tokenizer: Tokenizer = new Tokenizer("programExample.txt", "./test/testFiles");
        let programDecl: ProgramDecl = new ProgramDecl();
        programDecl.parse(tokenizer);

        expect(programDecl.contents.length).to.equal(2);
    });
});
