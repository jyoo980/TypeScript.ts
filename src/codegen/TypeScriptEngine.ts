import * as ts from "typescript";
import {FunctionDeclaration, Modifier, ParameterDeclaration, Printer, SyntaxKind, TypeNode, InterfaceDeclaration, TypeElement} from "typescript";
import {VarList} from "../ast/VarList";
import {TypeTable} from "../ast/symbols/TypeTable";
import FuncDecl from "../ast/FuncDecl";
import {InterfaceDecl} from "../ast/InterfaceDecl";
import CommentDecl from "../ast/CommentDecl";

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

        const funcDeclaration: FunctionDeclaration = ts.createFunctionDeclaration(
            /* decorators */ undefined,
            /* modifiers */ tsModifiers,
            /* asteriskToken */ undefined,
            funDecl.name,
            /* typeParameters */ undefined,
            tsParams,
            tsReturnType,
            undefined
        );
        this.addLeadingComment(funcDeclaration, funDecl.comments);
        return funcDeclaration;
    }

    // TODO: create class method.

    public createInterface(interfaceDecl: InterfaceDecl): InterfaceDeclaration {
        const tsMethodSignatures: TypeElement[] =
            interfaceDecl.functions.map((func: FuncDecl) => this.createMethodSignature(func));
        const tsPropertySignatures: TypeElement[] = this.fieldsToTsProperty(interfaceDecl.fieldDecl.fields);
        const interfaceMembers = tsMethodSignatures.concat(tsPropertySignatures);
        const interfaceDeclaration: InterfaceDeclaration = ts.createInterfaceDeclaration(
            // TODO: comments!
            /* decorators */ undefined,
            /* modifiers */ undefined,
            interfaceDecl.interfaceName,
            /* typeParams */ undefined,
            /* heritageClauses */ undefined,
            interfaceMembers
        );
        this.addLeadingComment(interfaceDeclaration, interfaceDecl.comments);
        return interfaceDeclaration;
    }

    private createMethodSignature(funcDecl: FuncDecl): TypeElement {
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

    private fieldsToTsProperty(fields: VarList): TypeElement[] {
        const fieldsAsList: [string, string][] = Array.from(fields.nameToType.entries());
        return fieldsAsList.map((nameTypePair) => {
            return this.makePropertySignature(nameTypePair[0], nameTypePair[1]);
        });
    }

    private makePropertySignature(name: string, type: string): TypeElement {
        return ts.createPropertySignature(
            /* modifiers */ undefined,
            name,
            /* questionToken */ undefined,
            this.typeTable.getTypeNode(type),
            /* initializer */ undefined
        );
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

    /**
     * Add a leading comment to node
     *
     * @param node          the node to add comments to
     * @param commentDecl   commentDecl object
     */
    private addLeadingComment(node: any, commentDecl: CommentDecl): void {
        const comments: string[] = commentDecl && commentDecl.comments;
        if (comments && comments.length) {
            const commentString: string = this.generateCommentString(comments);
            ts.addSyntheticLeadingComment(
                node,
                SyntaxKind.MultiLineCommentTrivia,
                commentString,
                true
            );
        }
    }
}
