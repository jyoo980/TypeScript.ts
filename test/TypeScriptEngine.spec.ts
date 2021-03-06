import * as ts from "typescript";
import { expect } from "chai";
import TypeScriptEngine from "../src/codegen/TypeScriptEngine";
import {VarList} from "../src/ast/VarList";
import { ParameterDeclaration, Modifier, SyntaxKind, FunctionDeclaration, InterfaceDeclaration, ClassDeclaration } from "typescript";
import {TypeTable} from "../src/ast/symbols/TypeTable";
import FuncDecl from "../src/ast/FuncDecl";
import {InterfaceDecl} from "../src/ast/InterfaceDecl";
import {FieldDecl} from "../src/ast/FieldDecl";
import CommentDecl from "../src/ast/CommentDecl";
import ReturnDecl from "../src/ast/ReturnDecl";
import {ClassDecl} from "../src/ast/ClassDecl";

describe("TypeScriptEngine tests", () => {

    let engine: TypeScriptEngine;
    let baseInterfaceDecl: InterfaceDecl;
    let baseClassDecl: ClassDecl;
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

    beforeEach(() => {
        engine = new TypeScriptEngine();
        baseFunDecl = new FuncDecl();
        baseFunDecl.returnDecl = new ReturnDecl();
        baseVarList = new VarList();
        baseInterfaceDecl = new InterfaceDecl(".");
        baseClassDecl = new ClassDecl(".");
        baseInterfaceDecl.fieldDecl = new FieldDecl();
        baseInterfaceDecl.fieldDecl.fields = new VarList();
    });

    it("should convert a VarList to a ParamDeclaration[]", () => {
        const vars: VarList = new VarList();
        vars.nameTypeMap = new Map();
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
        baseVarList.nameTypeMap = new Map();
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
        baseVarList.nameTypeMap = new Map();
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
        baseVarList.nameTypeMap = new Map();
        baseFunDecl.name = "foo";
        baseFunDecl.modifier = "public";
        baseFunDecl.params = baseVarList;
        baseFunDecl.returnDecl.returnType = "number";
        baseFunDecl.comments = new CommentDecl();
        baseFunDecl.comments.comments = ['comment line 1'];
        const result: FunctionDeclaration = engine.createFun(baseFunDecl);
        const resultStr: string = nodeToString(result);
        expect(resultStr).to.equal(`/**\n * comment line 1\n */\npublic function foo(): number;`);
    });

    it('should add a multiline comment with multiple lines to the function', () => {
        baseVarList.nameTypeMap = new Map();
        baseFunDecl.name = "foo";
        baseFunDecl.modifier = "public";
        baseFunDecl.params = baseVarList;
        baseFunDecl.returnDecl.returnType = "number";
        baseFunDecl.comments = new CommentDecl();
        baseFunDecl.comments.comments = ['comment line 1', 'comment line 2', 'comment line 3'];
        const result: FunctionDeclaration = engine.createFun(baseFunDecl);
        const resultStr: string = nodeToString(result);
        expect(resultStr).to.equal(`/**\n * comment line 1\n * comment line 2\n * comment line 3\n */\npublic function foo(): number;`);
    });

    it('should not add a comment to the function', () => {
        baseVarList.nameTypeMap = new Map();
        baseFunDecl.name = "foo";
        baseFunDecl.modifier = "public";
        baseFunDecl.params = baseVarList;
        baseFunDecl.returnDecl.returnType = "number";
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
            /* modifiers */ [ts.createModifier(SyntaxKind.ExportKeyword)],
            baseInterfaceDecl.interfaceName,
            /* typeParams */ undefined,
            /* heritageClauses */ undefined,
            []
        ));
    });

    it("should make a basic class declaration (no members)", () => {
        // class FooBar { }
        const name: string = "FooBar";
        baseClassDecl.className = name;
        baseClassDecl.functions = [];
        baseClassDecl.fields = [];
        let f: FieldDecl = new FieldDecl();
        f.fields = new VarList();
        baseClassDecl.fields.push(f);
        const result: ClassDeclaration = engine.createClass(baseClassDecl);
        expect(result).to.deep.equal(ts.createClassDeclaration(
            /* decorators */ undefined,
            /* modifiers */ [ts.createModifier(SyntaxKind.ExportKeyword)],
            baseClassDecl.className,
            /* typeParams */ undefined,
            /* heritageClauses */ undefined,
            []
        ));
    });

    it("should make a class declaration with members", () => {
        // class FooBar { }
        const name: string = "FooBar";
        baseClassDecl.className = name;
        baseClassDecl.functions = [];
        const fieldDecl: FieldDecl = new FieldDecl();
        fieldDecl.fields = new VarList();
        baseClassDecl.fields = [fieldDecl];
        const result: ClassDeclaration = engine.createClass(baseClassDecl);
        expect(result).to.deep.equal(ts.createClassDeclaration(
            /* decorators */ undefined,
            /* modifiers */ [ts.createModifier(SyntaxKind.ExportKeyword)],
            baseClassDecl.className,
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
        baseVarList.nameTypeMap = new Map();
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
            /* modifiers */ [ts.createModifier(SyntaxKind.ExportKeyword)],
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
        baseVarList.nameTypeMap = new Map();
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
            /* modifiers */ [ts.createModifier(SyntaxKind.ExportKeyword)],
            name,
            /* typeParams */ undefined,
            /* heritageClauses */ undefined,
            [ts.createPropertySignature(
                /* modifiers */ undefined,
                "foo",
                /* questionToken */ undefined,
                ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                /* initializer */ undefined
            ), ts.createMethodSignature(
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

    it("should make a class with method signatures and fields", () => {
        /* class InsightFacade {
         *       public foo: string;
         *       makeParamDecl(name: string, type: string): ParameterDecl;
         * }
         * */
        const name: string = "InsightFacade";
        const funName: string = "makeParamDecl";
        baseVarList.nameTypeMap = new Map();
        baseVarList.addPair("name", "string");
        baseVarList.addPair("type", "string");
        TypeTable.getInstance().addClass("ParameterDecl"); // add the class so we have access to it in the test
        const funDecl: FuncDecl = new FuncDecl();
        funDecl.name = funName;
        funDecl.modifier = "public";
        funDecl.params = baseVarList;
        funDecl.returnDecl = new ReturnDecl();
        funDecl.returnDecl.returnType = "ParameterDecl";
        baseClassDecl.className = name;
        baseClassDecl.functions = [funDecl];
        const fieldDecl: FieldDecl = new FieldDecl();
        fieldDecl.modifier = "public";
        fieldDecl.fields = new VarList();
        fieldDecl.fields.addPair("foo", "string");
        baseClassDecl.fields = [fieldDecl];
        const result: ClassDeclaration = engine.createClass(baseClassDecl);
        expect(result).to.deep.equal(ts.createClassDeclaration(
            /* decorators */ undefined,
            /* modifiers */ [ts.createModifier(SyntaxKind.ExportKeyword)],
            name,
            /* typeParams */ undefined,
            /* heritageClauses */ undefined,
            [ ts.createProperty(
                undefined,
                /* modifiers */ [ts.createModifier(SyntaxKind.PublicKeyword)],
                "foo",
                /* questionToken */ undefined,
                ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                /* initializer */ undefined
            ), ts.createMethod(
                /* typeParameters */ undefined,
                [ts.createModifier(SyntaxKind.PublicKeyword)],
                undefined,
                funDecl.name,
                undefined,
                undefined,
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
                /* body */ ts.createBlock([ts.createReturn(ts.createNull())], false)
            ),]
        ));
    });

    it("should make a class with method signatures", () => {
        /* class InsightFacade {
         *       foo: string;
         *       public makeParamDecl(name: string, type: string): ParameterDecl;
         * }
         * */
        const name: string = "InsightFacade";
        const funName: string = "makeParamDecl";
        baseVarList.nameTypeMap = new Map();
        baseVarList.addPair("name", "string");
        baseVarList.addPair("type", "string");
        TypeTable.getInstance().addClass("ParameterDecl"); // add the class so we have access to it in the test
        const funDecl: FuncDecl = new FuncDecl();
        funDecl.name = funName;
        funDecl.modifier = "public";
        funDecl.params = baseVarList;
        funDecl.returnDecl = new ReturnDecl();
        funDecl.returnDecl.returnType = "ParameterDecl";
        baseClassDecl.className = name;
        baseClassDecl.functions = [funDecl];
        baseClassDecl.fields = [];
        const result: ClassDeclaration = engine.createClass(baseClassDecl);
        expect(result).to.deep.equal(ts.createClassDeclaration(
            /* decorators */ undefined,
            /* modifiers */ [ts.createModifier(SyntaxKind.ExportKeyword)],
            name,
            /* typeParams */ undefined,
            /* heritageClauses */ undefined,
            [ts.createMethod(
                /* typeParameters */ undefined,
                [ts.createModifier(SyntaxKind.PublicKeyword)],
                undefined,
                funDecl.name,
                undefined,
                undefined,
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
                /* body */ ts.createBlock([ts.createReturn(ts.createNull())])
            )]
        ));

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
});
