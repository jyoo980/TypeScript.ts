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
    comment: CommentDecl;
    returnDecl: ReturnDecl;


    public parse(context: Tokenizer): any {
        let indentLevel: number = context.getCurrentLineTabLevel();
        context.getAndCheckNext("function");
        this.modifier = context.getNext();

        this.maybeStatic = new StaticDecl();
        this.maybeStatic.parse(context);
        this.maybeAsync = new AsyncDecl();
        this.maybeAsync.parse(context);

        this.name = context.getNext();
        if (context.getCurrentLineTabLevel() <= indentLevel) return;

        context.getAndCheckNext("params");
        this.params = new VarList();
        this.params.parse(context);

        this.comment = new CommentDecl();
        this.comment.parse(context);

        this.returnDecl = new ReturnDecl();
        this.returnDecl.parse(context);
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}
