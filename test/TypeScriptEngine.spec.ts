import TypeScriptEngine from "../src/codegen/TypeScriptEngine";
import {VarList} from "../src/ast/VarList";

describe("TypeScriptEngine tests", () => {

    let engine: TypeScriptEngine;

    before(() => {
        engine = new TypeScriptEngine();
    });

    it("should convert a VarList to a ParamDeclaration[]", () => {
        const vars: VarList = new VarList();
        vars.addPair("bar", "boolean");
        vars.addPair("baz", "number");
        console.log(engine["varsToParamDecl"](vars));
    });
});
