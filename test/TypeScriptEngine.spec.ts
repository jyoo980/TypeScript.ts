import * as ts from "typescript";
import { expect } from "chai";
import TypeScriptEngine from "../src/codegen/TypeScriptEngine";
import {VarList} from "../src/ast/VarList";
import { ParameterDeclaration, Modifier, SyntaxKind, FunctionDeclaration, InterfaceDeclaration } from "typescript";
import {TypeTable} from "../src/ast/symbols/TypeTable";
import FuncDecl from "../src/ast/FuncDecl";
import {InterfaceDecl} from "../src/ast/InterfaceDecl";
import {FieldDecl} from "../src/ast/FieldDecl";
import CommentDecl from "../src/ast/CommentDecl";
import ReturnDecl from "../src/ast/ReturnDecl";

describe("TypeScriptEngine tests", () => {

    let engine: TypeScriptEngine;
    let baseInterfaceDecl: InterfaceDecl;
    let baseFunDecl: FuncDecl;
    let baseVarList: VarList;

    function nodeToString(node: any) {
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
            node,
            resultFile
        );
        return result;
    }

    before(() => {
        engine = new TypeScriptEngine();
        baseFunDecl = new FuncDecl();
        baseFunDecl.returnDecl = new ReturnDecl();
        baseVarList = new VarList();
        baseInterfaceDecl = new InterfaceDecl();
        baseInterfaceDecl.fieldDecl = new FieldDecl();
        baseInterfaceDecl.fieldDecl.fields = new VarList();
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
        baseVarList.nameToType = new Map();
        baseFunDecl.name = "foo";
        baseFunDecl.modifier = "public";
        baseFunDecl.params = baseVarList;
        baseFunDecl.returnDecl.returnType = "number";
        const result: FunctionDeclaration = engine.createFun(baseFunDecl);
        expect(result).to.deep.equal(ts.createFunctionDeclaration(
            /* decorators */ undefined,
            /* modifiers */ [ts.createModifier(ts.SyntaxKind.PublicKeyword)],
            /* asteriskToken */ undefined,
            "foo",
            /* typeParameters */ undefined,
            [],
            ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
            undefined
        ));
    });

    it("should create a parameterized function declaration", () => {
        // public makeParamDecl(name: string, type: string): ParameterDecl;
        baseVarList.nameToType = new Map();
        baseVarList.addPair("name", "string");
        baseVarList.addPair("type", "string");
        TypeTable.getInstance().addClass("ParameterDecl"); // add the class so we have access to it in the test
        baseFunDecl.name = "makeParamDecl";
        baseFunDecl.modifier = "public";
        baseFunDecl.params = baseVarList;
        baseFunDecl.returnDecl.returnType = "ParameterDecl";
        const result: FunctionDeclaration = engine.createFun(baseFunDecl);
        expect(result).to.deep.equal(ts.createFunctionDeclaration(
            /* decorators */ undefined,
            /* modifiers */ [ts.createModifier(ts.SyntaxKind.PublicKeyword)],
            /* asteriskToken */ undefined,
            "makeParamDecl",
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

    it('should add a multiline comment with only one line to the function', () => {
        baseVarList.nameToType = new Map();
        baseFunDecl.name = "foo";
        baseFunDecl.modifier = "public";
        baseFunDecl.params = baseVarList;
        baseFunDecl.returnType = "number";
        baseFunDecl.comments = new CommentDecl();
        baseFunDecl.comments.comments = ['comment line 1'];
        const result: FunctionDeclaration = engine.createFun(baseFunDecl);
        const resultStr: string = nodeToString(result);
        expect(resultStr).to.equal(`/**\n * comment line 1\n */\npublic function foo(): number;`);
    });

    it('should add a multiline comment with multiple lines to the function', () => {
        baseVarList.nameToType = new Map();
        baseFunDecl.name = "foo";
        baseFunDecl.modifier = "public";
        baseFunDecl.params = baseVarList;
        baseFunDecl.returnType = "number";
        baseFunDecl.comments = new CommentDecl();
        baseFunDecl.comments.comments = ['comment line 1', 'comment line 2', 'comment line 3'];
        const result: FunctionDeclaration = engine.createFun(baseFunDecl);
        const resultStr: string = nodeToString(result);
        expect(resultStr).to.equal(`/**\n * comment line 1\n * comment line 2\n * comment line 3\n */\npublic function foo(): number;`);
    });

    it('should not add a comment to the function', () => {
        baseVarList.nameToType = new Map();
        baseFunDecl.name = "foo";
        baseFunDecl.modifier = "public";
        baseFunDecl.params = baseVarList;
        baseFunDecl.returnType = "number";
        baseFunDecl.comments = new CommentDecl();
        baseFunDecl.comments.comments = [];
        const result: FunctionDeclaration = engine.createFun(baseFunDecl);
        const resultStr: string = nodeToString(result);
        expect(resultStr).to.equal(`public function foo(): number;`);
    });

    it("should make a basic interface declaration (no members)", () => {
        // interface FooBar { }
        const name: string = "FooBar";
        baseInterfaceDecl.interfaceName = name;
        baseInterfaceDecl.functions = [];
        baseInterfaceDecl.fieldDecl = new FieldDecl();
        baseInterfaceDecl.fieldDecl.fields = new VarList();
        const result: InterfaceDeclaration = engine.createInterface(baseInterfaceDecl);
        expect(result).to.deep.equal(ts.createInterfaceDeclaration(
            /* decorators */ undefined,
            /* modifiers */ undefined,
            baseInterfaceDecl.interfaceName,
            /* typeParams */ undefined,
            /* heritageClauses */ undefined,
            []
        ));
    });

    it("should make an interface declaration with method signatures", () => {
        /* interface IInsightFacade {
         *       makeParamDecl(name: string, type: string): ParameterDecl;
         * }
         * */
        const name: string = "IInsightFacade";
        const funName: string = "makeParamDecl";
        baseVarList.nameToType = new Map();
        baseVarList.addPair("name", "string");
        baseVarList.addPair("type", "string");
        TypeTable.getInstance().addClass("ParameterDecl"); // add the class so we have access to it in the test
        baseFunDecl.name = funName;
        baseFunDecl.modifier = "public";
        baseFunDecl.params = baseVarList;
        baseFunDecl.returnDecl.returnType = "ParameterDecl";
        baseInterfaceDecl.interfaceName = name;
        baseInterfaceDecl.functions = [baseFunDecl];
        const result: InterfaceDeclaration = engine.createInterface(baseInterfaceDecl);
        expect(result).to.deep.equal(ts.createInterfaceDeclaration(
            /* decorators */ undefined,
            /* modifiers */ undefined,
            name,
            /* typeParams */ undefined,
            /* heritageClauses */ undefined,
            [ts.createMethodSignature(
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
                baseFunDecl.name,
                /* questionToken */ undefined
            )]
        ));
    });

    it("should make an interface with method signatures and fields", () => {
        /* interface IInsightFacade {
         *       foo: string;
         *       makeParamDecl(name: string, type: string): ParameterDecl;
         * }
         * */
        const name: string = "IInsightFacade";
        const funName: string = "makeParamDecl";
        baseVarList.nameToType = new Map();
        baseVarList.addPair("name", "string");
        baseVarList.addPair("type", "string");
        TypeTable.getInstance().addClass("ParameterDecl"); // add the class so we have access to it in the test
        baseFunDecl.name = funName;
        baseFunDecl.modifier = "public";
        baseFunDecl.params = baseVarList;
        baseFunDecl.returnDecl.returnType = "ParameterDecl";
        baseInterfaceDecl.interfaceName = name;
        baseInterfaceDecl.functions = [baseFunDecl];
        baseInterfaceDecl.fieldDecl.fields.addPair("foo", "string");
        const result: InterfaceDeclaration = engine.createInterface(baseInterfaceDecl);
        expect(result).to.deep.equal(ts.createInterfaceDeclaration(
            /* decorators */ undefined,
            /* modifiers */ undefined,
            name,
            /* typeParams */ undefined,
            /* heritageClauses */ undefined,
            [ts.createMethodSignature(
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
                baseFunDecl.name,
                /* questionToken */ undefined
            ),ts.createPropertySignature(
                /* modifiers */ undefined,
                "foo",
                /* questionToken */ undefined,
                ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                /* initializer */ undefined
            )]
        ));
    });

    it('should add a multiline comment with only one line to interface declaration', () => {
        // interface FooBar { }
        const name: string = "FooBar";
        baseInterfaceDecl.interfaceName = name;
        baseInterfaceDecl.functions = [];
        baseInterfaceDecl.fieldDecl = new FieldDecl();
        baseInterfaceDecl.fieldDecl.fields = new VarList();
        baseInterfaceDecl.comments = new CommentDecl();
        baseInterfaceDecl.comments.comments = ['comment line 1'];
        const result: InterfaceDeclaration = engine.createInterface(baseInterfaceDecl);
        const resultStr: string = nodeToString(result);
        expect(resultStr).to.equal(`/**\n * comment line 1\n */\ninterface FooBar {\n}`);
    });

    it('should add a multiline comment with multiple lines to interface declaration', () => {
        const name: string = "FooBar";
        baseInterfaceDecl.interfaceName = name;
        baseInterfaceDecl.functions = [];
        baseInterfaceDecl.fieldDecl = new FieldDecl();
        baseInterfaceDecl.fieldDecl.fields = new VarList();
        baseInterfaceDecl.comments = new CommentDecl();
        baseInterfaceDecl.comments.comments = ['comment line 1', 'comment line 2', 'comment line 3'];
        const result: InterfaceDeclaration = engine.createInterface(baseInterfaceDecl);
        const resultStr: string = nodeToString(result);
        expect(resultStr).to.equal(`/**\n * comment line 1\n * comment line 2\n * comment line 3\n */\ninterface FooBar {\n}`);
    });

    it('should not add a comment to interface declaration', () => {
        const name: string = "FooBar";
        baseInterfaceDecl.interfaceName = name;
        baseInterfaceDecl.functions = [];
        baseInterfaceDecl.fieldDecl = new FieldDecl();
        baseInterfaceDecl.fieldDecl.fields = new VarList();
        baseInterfaceDecl.comments = new CommentDecl();
        baseInterfaceDecl.comments.comments = [];
        const result: InterfaceDeclaration = engine.createInterface(baseInterfaceDecl);
        const resultStr: string = nodeToString(result);
        expect(resultStr).to.equal(`interface FooBar {\n}`);
    });
});
