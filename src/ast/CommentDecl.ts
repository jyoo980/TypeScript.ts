import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";

/**
 * Represents the comments that a class, interface, or method may have
 *
 * e.g. ind "comments" STRLIST ded
 */
export default class CommentDecl extends AstNode {

    comments: string[];

    public parse(context: Tokenizer): any {
        // We start by checking "[" here, since when we call this, we would have consumed the "comment" token already
        context.getAndCheckNext("\\[");
        this.comments = [];
        while (!context.checkToken("\\]")) {
            context.getAndCheckNext("\"");
            this.comments.push(context.getNext());
            context.getAndCheckNext("\"");
            if (!context.checkToken(",")) {
                break;
            }
            context.getAndCheckNext(",");
        }
        context.getNext();
    }

    public evaluate(): any {
        // TODO: implement this.
    }

}
