import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";

/**
 * Represents the comments that a class, interface, or method may have
 *
 * e.g. ind "comments" STRLIST ded
 */
export default class CommentDecl extends AstNode {

    comments: string[] = [];

    public parse(context: Tokenizer): any {
        if (context.checkToken("comments")) {
            context.getNext();
            context.getAndCheckNext("\\[");
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
    }

    public evaluate(): any {
        // TODO: implement this.
    }

}
