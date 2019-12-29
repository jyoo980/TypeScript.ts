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

export default abstract class Visitor {

    public visitAsyncDecl(node: AsyncDecl): void {

    }

    public visitClassDecl(node: ClassDecl): void {

    }

    public visitCommentDecl(node: CommentDecl): void {

    }

    public visitConstructorDecl(node: ConstructorDecl): void {

    }

    public visitContent(node: Content): void {

    }

    public visitDirDecl(node: DirDecl): void {

    }

    public visitExtendsDecl(node: ExtendsDecl): void {

    }

    public visitFieldDecl(node: FieldDecl): void {

    }

    public visitFuncDecl(node: FuncDecl): void {

    }

    public visitImplementsDecl(node: ImplementsDecl): void {

    }

    public visitInterfaceDecl(node: InterfaceDecl): void {

    }

    public visitModuleDecl(node: ModuleDecl): void {

    }

    public visitProgramDecl(node: ProgramDecl): void {

    }

    public visitReturnDecl(node: ReturnDecl): void {

    }

    public visitStaticDecl(node: StaticDecl): void {

    }

    public visitVarList(node: VarList): void {

    }

}
