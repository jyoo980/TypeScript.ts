import * as ts from "typescript";
import {FunctionDeclaration, Modifier, ParameterDeclaration, Printer, SyntaxKind, TypeNode} from "typescript";
import {VarList} from "../ast/VarList";
import {TypeTable} from "../ast/symbols/TypeTable";

export default class TypeScriptEngine {

    private readonly printer: Printer;
    private readonly typeTable: TypeTable;

    constructor() {
        this.printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
        this.typeTable = TypeTable.getInstance();
    }

    public createFun(name: string, modifiers: string[], params: VarList, returnType: string): FunctionDeclaration {
        const tsModifiers: Modifier[] = this.makeModifierNodes(modifiers);
        const tsParams: ParameterDeclaration[] = this.varsToParamDecl(params);
        const tsReturnType: TypeNode = this.typeTable.getTypeNode(returnType);
        return ts.createFunctionDeclaration(
            /* decorators */ undefined,
            /* modifiers */ tsModifiers,
            /* asteriskToken */ undefined,
            name,
            /* typeParameters */ undefined,
            tsParams,
            tsReturnType,
            undefined
        )
    }

    // TODO: create class method.

    // TODO: create interface method.

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
