import { expect } from "chai";
import {ClassDecl} from "../../src/ast/ClassDecl";
import {Tokenizer} from "../../src/util/Tokenizer";

describe("ClassDecl extractTabLevel test", () => {

    before(() => {
        Tokenizer.makeInstance("test", "");

    });

    after(() => {
        Tokenizer.destroyInstance();
    });

    it("should successfully convert indent token string to numerical value", () => {
        let classNode = new ClassDecl();
        expect(classNode.extractTabLevel('_INDENT_LEVEL=8_')).to.equal(8);
    });
});