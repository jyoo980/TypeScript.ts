import AsyncDecl from "../ast/AsyncDecl";
import {ClassDecl} from "../ast/ClassDecl";
import CommentDecl from "../ast/CommentDecl";
import ConstructorDecl from "../ast/ConstructorDecl";
import {Content} from "../ast/Content";
import {DirDecl} from "../ast/DirDecl";
import {ExtendsDecl} from "../ast/ExtendsDecl";
import {FieldDecl} from "../ast/FieldDecl";
import FuncDecl from "../ast/FuncDecl";
import {ImplementsDecl} from "../ast/ImplementsDecl";
import {InterfaceDecl} from "../ast/InterfaceDecl";
import {ModuleDecl} from "../ast/ModuleDecl";
import {ProgramDecl} from "../ast/ProgramDecl";
import ReturnDecl from "../ast/ReturnDecl";
import StaticDecl from "../ast/StaticDecl";
import {VarList} from "../ast/VarList";

export default interface IVisitor {
    visitAsyncDecl(node: AsyncDecl): void;
    visitClassDecl(node: ClassDecl): void;
    visitCommentDecl(node: CommentDecl): void;
    visitConstructorDecl(node: ConstructorDecl): void;
    visitContentDecl(node: Content): void;
    visitDirDecl(node: DirDecl): void;
    visitExtendsDecl(node: ExtendsDecl): void;
    visitFieldDecl(node: FieldDecl): void;
    visitFuncDecl(node: FuncDecl): void;
    visitImplementsDecl(node: ImplementsDecl): void;
    visitInterfaceDecl(node: InterfaceDecl): void;
    visitModuleDecl(node: ModuleDecl): void;
    visitProgramDecl(node: ProgramDecl): void;
    visitReturnDecl(node: ReturnDecl): void;
    visitStaticDecl(node: StaticDecl): void;
    visitVarListDecl(node: VarList): void;
}
