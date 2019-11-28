import AsyncDecl from "../ast/AsyncDecl";
import {ClassDecl} from "../ast/ClassDecl";
import {FieldDecl} from "../ast/FieldDecl";
import FuncDecl from "../ast/FuncDecl";
import CommentDecl from "../ast/CommentDecl";
import ConstructorDecl from "../ast/ConstructorDecl";
import {Content} from "../ast/Content";
import {DirDecl} from "../ast/DirDecl";
import {AstNode} from "../ast/AstNode";
import {ExtendsDecl} from "../ast/ExtendsDecl";
import {TypeCheckError, TypeTable} from "../ast/symbols/TypeTable";
import {ValidationError} from "../ast/errors/ASTErrors";
import {ImplementsDecl} from "../ast/ImplementsDecl";
import {InterfaceDecl} from "../ast/InterfaceDecl";
import {ProgramDecl} from "../ast/ProgramDecl";
import ReturnDecl from "../ast/ReturnDecl";
import StaticDecl from "../ast/StaticDecl";
import {VarList} from "../ast/VarList";
import {ModuleDecl} from "../ast/ModuleDecl";
import IVisitor from "./IVisitor";

export default class TypeCheckVisitor implements IVisitor {

    public visitAsyncDecl(node: AsyncDecl): void {

    }

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
        const typeTable: TypeTable = TypeTable.getInstance();
        const wasDeclared: boolean = typeTable.isValidType(node.parentName);
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
        const typeTable: TypeTable = TypeTable.getInstance();
        const allValidTypes: boolean = typeTable.areValidTypes(node.parentNames);
        if (!allValidTypes) {
            throw new TypeError(`At least one type from: ${node.parentNames} was not declared`);
        }
    }

    public visitInterfaceDecl(node: InterfaceDecl): void {
        if (node.extendsNodes !== undefined) {
            node.extendsNodes.accept(this);
        }
        if(node.extendsNodes) {
            node.extendsNodes.accept(this);
        }
        if(node.fieldDecl) {
            node.fieldDecl.accept(this);
        }
        node.functions.forEach((funcDecl: FuncDecl) => funcDecl.accept(this));
    }

    public visitReturnDecl(node: ReturnDecl): void {
        const typeTable: TypeTable = TypeTable.getInstance();
        const wasDeclared: boolean = typeTable.isValidType(node.returnType.replace(/[\[\]]/g, ""));
        if (!wasDeclared) {
            throw new TypeCheckError(`Type: ${node.returnType} was not defined`);
        }
    }

    public visitVarListDecl(node: VarList): void {
        const fieldTypes: string[] = Array.from(node.nameTypeMap.values())
            .map((fieldType) => {
                // filter out [] from type before checking against typeTable
                return fieldType.replace(/[\[\]]/g, "");
            });
        const typeTable: TypeTable = TypeTable.getInstance();
        const allValidTypes: boolean = typeTable.areValidTypes(fieldTypes);
        if (!allValidTypes) {
            throw new TypeCheckError(`At least one type from: ${fieldTypes} was not declared`);
        }
    }

    public visitCommentDecl(node: CommentDecl): void {
    }

    public visitContentDecl(node: Content): void {
    }

    public visitModuleDecl(node: ModuleDecl): void {
    }

    public visitProgramDecl(node: ProgramDecl): void {
    }

    public visitStaticDecl(node: StaticDecl): void {
    }
}
