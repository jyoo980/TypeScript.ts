import { expect } from "chai";
import {ClassDecl} from "../../src/ast/ClassDecl";

describe("ClassDecl extractTabLevel test", () => {

    it("should successfully convert indent token string to numerical value", () => {
        let classNode = new ClassDecl();
        expect(classNode.extractTabLevel('_INDENT_LEVEL=8_')).to.equal(8);
    });
});