import {AstNode} from "./AstNode";

/**
 * Represents the comments that a class, interface, or method may have
 *
 * e.g. ind "comments" STRLIST ded
 */
export default class Comment extends AstNode {

    comments: string[];

    public parse(): any {
        // TODO: implement the rest.
        this.comments = [];
    }

    public evaluate(): any {
        // TODO: implement this.
    }

}
