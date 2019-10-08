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
        // TODO: implement the rest.
        this.comments = [];
    }

    public evaluate(): any {
        // TODO: implement this.
    }

}
