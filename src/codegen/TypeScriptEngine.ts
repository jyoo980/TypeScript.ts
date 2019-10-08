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

    public createFun(name: string, modifiers: string[], params: VarList, returnType: string, comments?: string[]): FunctionDeclaration {
        const tsModifiers: Modifier[] = this.makeModifierNodes(modifiers);
        const tsParams: ParameterDeclaration[] = this.varsToParamDecl(params);
        const tsReturnType: TypeNode = this.typeTable.getTypeNode(returnType);

        const funcDeclaration = ts.createFunctionDeclaration(
            /* decorators */ undefined,
            /* modifiers */ tsModifiers,
            /* asteriskToken */ undefined,
            name,
            /* typeParameters */ undefined,
            tsParams,
            tsReturnType,
            undefined
        );

        if (comments && comments.length) {
            const commentString: string = this.generateCommentString(comments);
            ts.addSyntheticLeadingComment(
                funcDeclaration,
                SyntaxKind.MultiLineCommentTrivia,
                commentString,
                true
            );
        }
        
        return funcDeclaration;
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

    /**
     * Format comments into a single string for TS compiler api
     *
     * @param comments      comments to process
     * @returns string      formatted string for TS compiler api
     */
    private generateCommentString(comments: string[]): string {
        const result: string = comments.reduce((acc, curr) => acc += ` * ${curr}\n`, '');
        return `*\n${result} `;
    }
}
