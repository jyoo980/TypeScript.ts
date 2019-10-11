import {AstNode} from "./AstNode";
import {VarList} from "./VarList";
import CommentDecl from "./CommentDecl";
import {Tokenizer} from "../util/Tokenizer";
import StaticDecl from "./StaticDecl";
import AsyncDecl from "./AsyncDecl";
import ReturnDecl from "./ReturnDecl";

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
        this.modifier = context.getNext();

        this.maybeStatic = new StaticDecl();
        this.maybeStatic.parse(context);
        this.maybeAsync = new AsyncDecl();
        this.maybeAsync.parse(context);

        this.params = new VarList();
        this.comments = new CommentDecl();

        this.name = context.getNext();
        if (context.checkToken("returns")) {
            this.returnDecl.parse(context);
        }
        if (context.getCurrentLineTabLevel() <= indentLevel) return;

        if (context.checkToken("params")) {
            context.getAndCheckNext("params");
            this.params.parse(context);
            this.comments.parse(context);
        }
        this.returnDecl.parse(context);
    }

    public evaluate(): any {
        // TODO: implement this.
    }

    public typeCheck(): void {
        this.params.typeCheck();
        this.returnDecl.typeCheck();
    }
}
