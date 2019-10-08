import * as ts from "typescript";
import {FunctionDeclaration,
        Modifier,
        ParameterDeclaration,
        Printer,
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
        const tsReturnType: TypeNode = this.typeTable.getTypeNode(funDecl.returnDecl.returnType);
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

    public createClass(classDecl: ClassDecl): ClassDeclaration {
        // Add function declarations
        const classMembers: ClassElement[] =
            classDecl.functions.map((func: FuncDecl) => this.createMethod(func));

        // Add field declarations
        for (let field of classDecl.fields) {
            classMembers.concat(this.fieldsToTsProperty(field.fields));
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
        const tsPropertySignatures: TypeElement[] = this.fieldsToTsProperty(interfaceDecl.fieldDecl.fields);
        const interfaceMembers = tsMethodSignatures.concat(tsPropertySignatures);
        return ts.createInterfaceDeclaration(
            // TODO: comments!
            /* decorators */ undefined,
            /* modifiers */ undefined,
            interfaceDecl.interfaceName,
            /* typeParams */ undefined,
            /* heritageClauses */ undefined,
            interfaceMembers
        );
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
        const tsReturnType: TypeNode = this.typeTable.getTypeNode(funcDecl.returnType);
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
}
