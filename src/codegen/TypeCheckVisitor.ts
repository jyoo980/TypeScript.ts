import Visitor from "./Visitor";
import {FieldDecl} from "../ast/FieldDecl";
import FuncDecl from "../ast/FuncDecl";
import {ClassDecl} from "../ast/ClassDecl";
import ConstructorDecl from "../ast/ConstructorDecl";
import {AstNode} from "../ast/AstNode";
import {DirDecl} from "../ast/DirDecl";
import {TypeCheckError, TypeTable} from "../ast/symbols/TypeTable";
import {ExtendsDecl} from "../ast/ExtendsDecl";
import {ValidationError} from "../ast/errors/ASTErrors";
import {ImplementsDecl} from "../ast/ImplementsDecl";
import {InterfaceDecl} from "../ast/InterfaceDecl";
import ReturnDecl from "../ast/ReturnDecl";
import {VarList} from "../ast/VarList";

export default class TypeCheckVisitor extends Visitor {

    private typeTable: TypeTable = TypeTable.getInstance();

    public visitClassDecl(node: ClassDecl): void {
        if (node.extendsNodes !== undefined) {
            node.extendsNodes.accept(this);
        }
        node.fields.forEach((fieldDecl: FieldDecl) => fieldDecl.accept(this));
        node.functions.forEach((funcDecl: FuncDecl) => funcDecl.accept(this));
    }

    public visitConstructorDecl(node: ConstructorDecl): void {
        node.params.accept(this);
    }

    public visitDirDecl(node: DirDecl): void {
        node.contents.forEach((content: AstNode) => content.accept(this));
    }

    public visitExtendsDecl(node: ExtendsDecl): void {
        const wasDeclared: boolean = this.typeTable.isValidType(node.parentName);
        if (!wasDeclared) {
            throw new TypeCheckError(`Type: ${node.parentName} was not defined`);
        }
    }

    public visitFieldDecl(node: FieldDecl): void {
        if (node.isInterfaceField && node.modifier !== "public") {
            throw new ValidationError("Interfaces cannot have non-public fields");
        }
        node.fields.accept(this);
    }

    public visitFuncDecl(node: FuncDecl): void {
        node.params.accept(this);
        node.returnDecl.accept(this);
    }

    public visitImplementsDecl(node: ImplementsDecl): void {
        const allValidTypes: boolean = this.typeTable.areValidTypes(node.parentNames);
        if (!allValidTypes) {
            throw new TypeError(`At least one type from: ${node.parentNames} was not declared`);
        }
    }

    public visitInterfaceDecl(node: InterfaceDecl): void {
        if (node.extendsNodes !== undefined) {
            node.extendsNodes.accept(this);
        }
        if(node.fieldDecl) {
            node.fieldDecl.accept(this);
        }
        node.functions.forEach((funcDecl: FuncDecl) => funcDecl.accept(this));
    }

    public visitReturnDecl(node: ReturnDecl): void {
        const wasDeclared: boolean =
            this.typeTable.isValidType(node.returnType.replace(/[\[\]]/g, ""));
        if (!wasDeclared) {
            throw new TypeCheckError(`Type: ${node.returnType} was not defined`);
        }
    }

    public visitVarList(node: VarList): void {
        const fieldTypes: string[] = [...node.nameTypeMap.values()]
            .map((fieldType) => {
                // filter out [] from type before checking against typeTable
                return fieldType.replace(/[\[\]]/g, "");
            });
        const allValidTypes: boolean = this.typeTable.areValidTypes(fieldTypes);
        if (!allValidTypes) {
            throw new TypeCheckError(`At least one type from: ${fieldTypes} was not declared`);
        }
    }
}
