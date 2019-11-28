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
    visit(node: AsyncDecl): void;
    visit(node: ClassDecl): void;
    visit(node: CommentDecl): void;
    visit(node: ConstructorDecl): void;
    visit(node: Content): void;
    visit(node: DirDecl): void;
    visit(node: ExtendsDecl): void;
    visit(node: FieldDecl): void;
    visit(node: FuncDecl): void;
    visit(node: ImplementsDecl): void;
    visit(node: InterfaceDecl): void;
    visit(node: ModuleDecl): void;
    visit(node: ProgramDecl): void;
    visit(node: ReturnDecl): void;
    visit(node: StaticDecl): void;
    visit(node: VarList): void;
}
