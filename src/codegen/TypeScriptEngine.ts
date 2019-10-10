import * as ts from "typescript";
import {FunctionDeclaration,
        Modifier,
        ParameterDeclaration,
        SyntaxKind,
        TypeNode,
        ClassDeclaration,
        InterfaceDeclaration,
        ClassElement,
        TypeElement} from "typescript";
import {VarList} from "../ast/VarList";
import {TypeTable} from "../ast/symbols/TypeTable";
import FuncDecl from "../ast/FuncDecl";
import {InterfaceDecl} from "../ast/InterfaceDecl";
import {ClassDecl} from "../ast/ClassDecl";
import CommentDecl from "../ast/CommentDecl";

export default class TypeScriptEngine {

    private readonly typeTable: TypeTable;

    constructor() {
        this.typeTable = TypeTable.getInstance();
    }

    public createFun(funDecl: FuncDecl): FunctionDeclaration {
        // TODO: check if modifier is undefined
        const tsModifiers: Modifier[] = this.makeModifierNodes([funDecl.modifier]);
        const tsParams: ParameterDeclaration[] = this.varsToParamDecl(funDecl.params);

        const tsReturnType: TypeNode = this.typeTable.getTypeNode(funDecl.returnDecl.returnType);
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

    public createClass(classDecl: ClassDecl): ClassDeclaration {
        // Add function declarations
        let classMembers: ClassElement[] =
            classDecl.functions.map((func: FuncDecl) => this.createMethod(func));

        // Add field declarations
        for (let field of classDecl.fields) {
            classMembers = classMembers.concat(this.fieldsToClassElement(field.fields));
        }

        return ts.createClassDeclaration(
            undefined,
            undefined,
            classDecl.className,
            undefined,
            undefined,
            classMembers
        )
    }

    public createInterface(interfaceDecl: InterfaceDecl): InterfaceDeclaration {
        const tsMethodSignatures: TypeElement[] =
            interfaceDecl.functions.map((func: FuncDecl) => this.createMethodSignature(func));
        const tsPropertySignatures: TypeElement[] = this.fieldsToTypeElement(interfaceDecl.fieldDecl.fields);
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
        const tsReturnType: TypeNode = this.typeTable.getTypeNode(funcDecl.returnDecl.returnType);
        return ts.createMethodSignature(
            /* typeParameters */ undefined,
            tsParams,
            tsReturnType,
            funcDecl.name,
            /* questionToken */ undefined
        )
    }

    private createMethod(funcDecl: FuncDecl): ClassElement {
        const tsParams: ParameterDeclaration[] = this.varsToParamDecl(funcDecl.params);
        const tsReturnType: TypeNode = this.typeTable.getTypeNode(funcDecl.returnDecl.returnType);
        return ts.createMethod(
            undefined,
            undefined,
            undefined,
            funcDecl.name,
            undefined,
            undefined,
            tsParams,
            tsReturnType,
            undefined
        )
    }

    private fieldsToTypeElement(fields: VarList): TypeElement[] {
        const fieldsAsList: [string, string][] = Array.from(fields.nameToType.entries());
        return fieldsAsList.map((nameTypePair) => {
            return this.makePropertySignature(nameTypePair[0], nameTypePair[1]);
        });
    }

    private fieldsToClassElement(fields: VarList): ClassElement[] {
        const fieldsAsList: [string, string][] = Array.from(fields.nameToType.entries());
        return fieldsAsList.map((nameTypePair) => {
            return this.makeProperty(nameTypePair[0], nameTypePair[1]);
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

    private makeProperty(name: string, type: string): ClassElement {
        return ts.createProperty(
            /* decorators */ undefined,
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
