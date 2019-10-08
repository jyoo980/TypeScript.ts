import * as ts from "typescript";
import { expect } from "chai";
import TypeScriptEngine from "../src/codegen/TypeScriptEngine";
import {VarList} from "../src/ast/VarList";
import { ParameterDeclaration, Modifier, SyntaxKind, FunctionDeclaration } from "typescript";
import {TypeTable} from "../src/ast/symbols/TypeTable";

describe("TypeScriptEngine tests", () => {

    let engine: TypeScriptEngine;

    before(() => {
        engine = new TypeScriptEngine();
    });

    it("should convert a VarList to a ParamDeclaration[]", () => {
        const vars: VarList = new VarList();
        vars.nameToType = new Map();
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
        const emptyVarList: VarList = new VarList();
        emptyVarList.nameToType = new Map();
        const result: FunctionDeclaration = engine.createFun(funName, [], emptyVarList, "number");
        console.log(result);
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

    it("should create a parameterized function declaration", () => {
        // public makeParamDecl(name: string, type: string): ParameterDecl;
        const funName: string = "makeParamDecl";
        const varList: VarList = new VarList();
        varList.nameToType = new Map();
        varList.addPair("name", "string");
        varList.addPair("type", "string");
        TypeTable.getInstance().addClass("ParameterDecl"); // add the class so we have access to it in the test
        const result: FunctionDeclaration = engine.createFun(funName, ["public"], varList, "ParameterDecl");
        expect(result).to.deep.equal(ts.createFunctionDeclaration(
            /* decorators */ undefined,
            /* modifiers */ [ts.createModifier(ts.SyntaxKind.PublicKeyword)],
            /* asteriskToken */ undefined,
            funName,
            /* typeParameters */ undefined,
            [
                ts.createParameter(
                /* decorators */ undefined,
                /* modifiers */ undefined,
                /* dotDotToken */ undefined,
                "name",
                /* questionToken */ undefined,
                    ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)),
                ts.createParameter(
                    /* decorators */ undefined,
                    /* modifiers */ undefined,
                    /* dotDotToken */ undefined,
                    "type",
                    /* questionToken */ undefined,
                    ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
                )],
            ts.createTypeReferenceNode("ParameterDecl", undefined),
            undefined
        ));
    });

    it('should add a multiline comment to the function', () => {
        // const varList: VarList = new VarList();
        // const result = engine.createFun('foo', ['public'], varList, 'void', ['comment line 1', 'comment line 2', 'comment line 3']);
        // console.log(toText(result));
    });

    function toText(func: FunctionDeclaration) {
        const resultFile = ts.createSourceFile(
            "someFileName.ts",
            "",
            ts.ScriptTarget.Latest,
            /*setParentNodes*/ false,
            ts.ScriptKind.TS
        );
        const printer = ts.createPrinter({
            newLine: ts.NewLineKind.LineFeed
        });
        const result = printer.printNode(
            ts.EmitHint.Unspecified,
            // replace this line with our call to createFun, or the result of it from the tests
            func,
            resultFile
        );
        return result;
    }
});
