import * as ts from "typescript";
import {FunctionDeclaration, Modifier, ParameterDeclaration, Printer, SyntaxKind, TypeNode, InterfaceDeclaration, MethodSignature} from "typescript";
import {VarList} from "../ast/VarList";
import {TypeTable} from "../ast/symbols/TypeTable";
import FuncDecl from "../ast/FuncDecl";
import {InterfaceDecl} from "../ast/InterfaceDecl";

export default class TypeScriptEngine {

    private readonly printer: Printer;
    private readonly typeTable: TypeTable;

    constructor() {
        this.printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
        this.typeTable = TypeTable.getInstance();
    }

    public createFun(funDecl: FuncDecl): FunctionDeclaration {
        // TODO: check if modifier is undefined
        const tsModifiers: Modifier[] = this.makeModifierNodes([funDecl.modifier]);
        const tsParams: ParameterDeclaration[] = this.varsToParamDecl(funDecl.params);
        const tsReturnType: TypeNode = this.typeTable.getTypeNode(funDecl.returnType);
        // TODO: comments!
        return ts.createFunctionDeclaration(
            /* decorators */ undefined,
            /* modifiers */ tsModifiers,
            /* asteriskToken */ undefined,
            funDecl.name,
            /* typeParameters */ undefined,
            tsParams,
            tsReturnType,
            undefined
        )
    }

    // TODO: create class method.

    public createInterface(interfaceDecl: InterfaceDecl): InterfaceDeclaration {
        const tsMethodSignatures: MethodSignature[] =
            interfaceDecl.functions.map((func: FuncDecl) => this.createMethodSignature(func));
        return ts.createInterfaceDeclaration(
            /* decorators */ undefined,
            /* modifiers */ undefined,
            interfaceDecl.interfaceName,
            /* typeParams */ undefined,
            // TODO: implement inheritance
            /* heritageClauses */ undefined,
            tsMethodSignatures
        );
    }

    private createMethodSignature(funcDecl: FuncDecl): MethodSignature {
        const tsParams: ParameterDeclaration[] = this.varsToParamDecl(funcDecl.params);
        const tsReturnType: TypeNode = this.typeTable.getTypeNode(funcDecl.returnType);
        return ts.createMethodSignature(
            /* typeParameters */ undefined,
            tsParams,
            tsReturnType,
            funcDecl.name,
            /* questionToken */ undefined
        )
    }

    private varsToParamDecl(vars: VarList): ParameterDeclaration[] {
        const varsAsList: [string, string][] = Array.from(vars.nameToType.entries());
        return varsAsList.map((nameTypePair) => {
            return this.makeParamDecl(nameTypePair[0], nameTypePair[1]);
        });
    }

    private makeParamDecl(name: string, type: string): ParameterDeclaration {
        return ts.createParameter(
            /* decorators */ undefined,
            /* modifiers */ undefined,
            /* dotDotToken */ undefined,
            name,
            /* questionToken */ undefined,
            this.typeTable.getTypeNode(type)
        );
    }

    private makeModifierNodes(modifiers: string[]): Modifier[] {
        return modifiers.map((modifierAsString) => {
            return ts.createModifier(this.mapToSyntaxKind(modifierAsString));
        });
    }

    private mapToSyntaxKind(modifierString: string) {
        switch (modifierString) {
            case "public": return SyntaxKind.PublicKeyword;
            case "protected": return SyntaxKind.ProtectedKeyword;
            case "private": return SyntaxKind.PrivateKeyword;
            case "async": return SyntaxKind.AsyncKeyword;
            case "static": return SyntaxKind.StaticKeyword;
            case "abstract": return SyntaxKind.AbstractKeyword;
        }
    }
}
