import * as ts from "typescript";
import {FunctionDeclaration,
        Modifier,
        ParameterDeclaration,
        SyntaxKind,
        TypeNode,
        ClassDeclaration,
        InterfaceDeclaration,
        ClassElement,
        TypeElement,
        Block,
        Statement,
        HeritageClause} from "typescript";
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
        let classMembers: ClassElement[] = [];

        // Add field declarations
        for (let field of classDecl.fields) {
            classMembers = classMembers.concat(this.fieldsToClassElement(field.fields, field.modifier));
        }

        // Add function declarations
        for(let fn of classDecl.functions) {
            classMembers.push(this.createMethod(fn));
        }

        return ts.createClassDeclaration(
            undefined,
            [ts.createModifier(SyntaxKind.ExportKeyword)],
            classDecl.className,
            undefined,
            this.makeHeritageClause(classDecl),
            classMembers
        );
    }

    private makeHeritageClause(classDecl: ClassDecl): HeritageClause[] {
        if (classDecl.implementsNodes !== undefined) {
            const parentNames: string[] = classDecl.implementsNodes.parentNames;
            const interfaces: HeritageClause = ts.createHeritageClause(
                ts.SyntaxKind.ImplementsKeyword,
                parentNames.map((name) =>
                    ts.createExpressionWithTypeArguments(undefined, ts.createIdentifier(name)))
                );
            return [interfaces];
        }
        return undefined;
    }

    public createInterface(interfaceDecl: InterfaceDecl): InterfaceDeclaration {
        const tsMethodSignatures: TypeElement[] =
            interfaceDecl.functions.map((func: FuncDecl) => this.createMethodSignature(func));
        const tsPropertySignatures: TypeElement[] = this.createTsPropertySignatures(interfaceDecl);
        const interfaceMembers = tsMethodSignatures.concat(tsPropertySignatures);
        const interfaceDeclaration: InterfaceDeclaration = ts.createInterfaceDeclaration(
            /* decorators */ undefined,
            [ts.createModifier(SyntaxKind.ExportKeyword)],
            interfaceDecl.interfaceName,
            /* typeParams */ undefined,
            this.makeInterfaceHeritageClause(interfaceDecl),
            interfaceMembers
        );
        return interfaceDeclaration;
    }

    private makeInterfaceHeritageClause(interfaceDecl: InterfaceDecl): HeritageClause[] {
        if (interfaceDecl.extendsNodes !== undefined) {
            const parentName: string = interfaceDecl.extendsNodes.parentName;
            const interfaces: HeritageClause = ts.createHeritageClause(
                ts.SyntaxKind.ExtendsKeyword,
                    [ts.createExpressionWithTypeArguments(undefined, ts.createIdentifier(parentName))]);
            return [interfaces];
        }
        return undefined;
    }

    private createTsPropertySignatures(interfaceDecl: InterfaceDecl): TypeElement[] {
        if (interfaceDecl.fieldDecl == undefined) {
            return [] as TypeElement[];
        } else {
            return this.fieldsToTypeElement(interfaceDecl.fieldDecl.fields);
        }
    }

    private createMethodSignature(funcDecl: FuncDecl): TypeElement {
        // TODO: handle comments here
        const tsParams: ParameterDeclaration[] = this.varsToParamDecl(funcDecl.params);
        const tsReturnType: TypeNode = this.typeTable.getTypeNode(funcDecl.returnDecl.returnType);
        const methodSignature = ts.createMethodSignature(
            /* typeParameters */ undefined,
            tsParams,
            tsReturnType,
            funcDecl.name,
            /* questionToken */ undefined
        );
        this.addLeadingComment(methodSignature, funcDecl.comments);
        return methodSignature;
    }

    private createMethod(funcDecl: FuncDecl): ClassElement {
        const tsModifiers: Modifier[] = this.makeMethodModifiers(funcDecl);
        const tsParams: ParameterDeclaration[] = this.varsToParamDecl(funcDecl.params);
        const tsReturnType: TypeNode = this.typeTable.getTypeNode(funcDecl.returnDecl.returnType);
        const retStatement = [];
        if(!tsReturnType || tsReturnType !== this.typeTable.getTypeNode("void")) {
            retStatement.push(ts.createReturn(ts.createNull()));
        }
        const methodSig =  ts.createMethod(
            undefined,
            tsModifiers,
            undefined,
            funcDecl.name,
            undefined,
            undefined,
            tsParams,
            tsReturnType,
            this.makeBody(funcDecl, retStatement)
        );
        this.addLeadingComment(methodSig, funcDecl.comments);
        return methodSig;
    }

    private makeBody(funcDecl: FuncDecl, defaultRetStatement: Statement[]): Block {
        const funcName: string = funcDecl.name;
        if (funcName.includes("get")) {
            const nameOfField: string = funcName.split("get")[1];
            const fieldAsLowercase: string = nameOfField.charAt(0).toLowerCase() + nameOfField.slice(1);
            const statements: Statement[] = [ts.createReturn(ts.createIdentifier(`this.${fieldAsLowercase}`))];
            return ts.createBlock(statements, false);
        } else if (funcName.includes("set")) {
            const nameOfField: string = funcName.split("set")[1];
            const fieldAsLowercase: string = nameOfField.charAt(0).toLowerCase() + nameOfField.slice(1);
            const setterBody: Statement[] = [ts.createExpressionStatement(ts.createBinary(
                ts.createIdentifier(`this.${fieldAsLowercase}`),
                ts.SyntaxKind.EqualsToken,
                ts.createIdentifier(fieldAsLowercase))
            )];
            return ts.createBlock(setterBody, false);
        } else {
            return ts.createBlock(defaultRetStatement, false);
        }

    }

    private makeMethodModifiers(funcDecl: FuncDecl): Modifier[] {
        if (funcDecl.modifier) {
            return this.makeModifierNodes([funcDecl.modifier]);
        } else {
            return [ts.createModifier(SyntaxKind.PublicKeyword)];
        }
    }

    private fieldsToTypeElement(fields: VarList): TypeElement[] {
        const fieldsAsList: [string, string][] = Array.from(fields.nameTypeMap.entries());
        return fieldsAsList.map((nameTypePair) => {
            return this.makePropertySignature(nameTypePair[0], nameTypePair[1]);
        });
    }

    private fieldsToClassElement(fields: VarList, modifier: string): ClassElement[] {
        const fieldsAsList: [string, string][] = Array.from(fields.nameTypeMap.entries());
        return fieldsAsList.map((nameTypePair) => {
            return this.makeProperty(nameTypePair[0], nameTypePair[1], modifier);
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

    private makeProperty(name: string, type: string, modifier: string): ClassElement {
        const tsModifiers: Modifier[] = this.makeFieldModifiers(modifier);
        return ts.createProperty(
            /* decorators */ undefined,
            tsModifiers,
            name,
            /* questionToken */ undefined,
            this.typeTable.getTypeNode(type),
            /* initializer */ undefined
        );
    }

    private makeFieldModifiers(modifier: string): Modifier[] {
        return this.makeModifierNodes([modifier]);
    }

    private varsToParamDecl(vars: VarList): ParameterDeclaration[] {
        const varsAsList: [string, string][] = Array.from(vars.nameTypeMap.entries());
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
