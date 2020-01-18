import {AstNode} from "./AstNode";
import {VarList} from "./VarList";
import CommentDecl from "./CommentDecl";
import {Tokenizer} from "../util/Tokenizer";
import StaticDecl from "./StaticDecl";
import AsyncDecl from "./AsyncDecl";
import ReturnDecl from "./ReturnDecl";
import Visitor from "../codegen/Visitor";

/**
 * Represents a function declaration in our language
 *
 * e.g. function modifier static? async? str
 *          params []
 *          comments?
 *          (return TYPE)?
 */
export default class FuncDecl extends AstNode {

    modifier: string;
    maybeStatic: StaticDecl;
    maybeAsync: AsyncDecl;
    name: string;
    params: VarList;
    comments: CommentDecl;
    returnDecl: ReturnDecl = new ReturnDecl();

    public parse(context: Tokenizer): any {
        let indentLevel: number = context.getCurrentLineTabLevel();
        context.getAndCheckNext("function");
        this.returnDecl.returnType = "void";

        if (context.checkToken("private") || context.checkToken("public") || context.checkToken("protected")) {
            this.modifier = context.getNext();
        } else {
            this.modifier = "public";
        }

        this.maybeStatic = new StaticDecl();
        this.maybeStatic.parse(context);
        this.maybeAsync = new AsyncDecl();
        this.maybeAsync.parse(context);

        this.params = new VarList();
        this.comments = new CommentDecl();

        this.name = context.getNext();

        context.checkStartOfLine();

        if (context.getCurrentLineTabLevel() <= indentLevel) return;
        context.checkStartOfLine();

        if(context.checkToken("comments")) {
            this.comments.parse(context);
        }

        if (context.getCurrentLineTabLevel() <= indentLevel) return;
        context.checkStartOfLine();

        if (context.checkToken("params")) {
            context.getAndCheckNext("params");
            this.params.parse(context);
        }

        if (context.getCurrentLineTabLevel() <= indentLevel) return;
        context.checkStartOfLine();

        if(context.checkToken("returns")) {
            this.returnDecl.parse(context);
        }
    }

    public accept(v: Visitor): void {
        v.visitFuncDecl(this);
    }
}
