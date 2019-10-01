import * as ts from "typescript";
import { expect } from "chai";
import TypeScriptEngine from "../src/codegen/TypeScriptEngine";
import {VarList} from "../src/ast/VarList";
import { ParameterDeclaration, Modifier, SyntaxKind, FunctionDeclaration } from "typescript";

describe("TypeScriptEngine tests", () => {

    let engine: TypeScriptEngine;

    before(() => {
        engine = new TypeScriptEngine();
    });

    it("should convert a VarList to a ParamDeclaration[]", () => {
        const vars: VarList = new VarList();
        const expected: ParameterDeclaration[] = [
            ts.createParameter(
            /* decorators */ undefined,
            /* modifiers */ undefined,
            /* dotDotToken */ undefined,
            "bar",
            /* questionToken */ undefined,
                ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)),
            ts.createParameter(
                /* decorators */ undefined,
                /* modifiers */ undefined,
                /* dotDotToken */ undefined,
                "baz",
                /* questionToken */ undefined,
                ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword))
        ];
        vars.addPair("bar", "boolean");
        vars.addPair("baz", "number");
        expect(engine["varsToParamDecl"](vars)).to.deep.equal(expected);
    });

    it("should convert a list of modifiers as string to TypeScript Modifier nodes", () => {
        const modifiers: string[] = ["public", "private", "protected"];
        const expected: Modifier[] = [
            ts.createModifier(SyntaxKind.PublicKeyword),
            ts.createModifier(SyntaxKind.PrivateKeyword),
            ts.createModifier(SyntaxKind.ProtectedKeyword)
        ];
        expect(engine["makeModifierNodes"](modifiers)).to.deep.equal(expected);
    });

    it("should create a simple function declaration - foo(): number", () => {
        const funName: string = "foo";
        const result: FunctionDeclaration = engine.createFun(funName, [], new VarList(), "number");
        expect(result).to.deep.equal(ts.createFunctionDeclaration(
            /* decorators */ undefined,
            /* modifiers */ [],
            /* asteriskToken */ undefined,
            funName,
            /* typeParameters */ undefined,
            [],
            ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
            undefined
        ));
    });
});
