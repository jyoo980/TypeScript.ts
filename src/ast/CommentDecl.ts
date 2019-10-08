import {Tokenizer} from "../util/Tokenizer";
import { StringArray } from "./StringArray";

/**
 * Represents the comments that a class, interface, or method may have
 *
 * e.g. ind "comments" STRLIST ded
 */
export default class CommentDecl extends StringArray {

    comments: string[];

    public parse(context: Tokenizer): any {
        if (!context.getAndCheckNext('comments')) {
            throw new Error('Expected comments keyword');
        };

        this.comments = [];
        const currentLevel = context.getCurrentLineTabLevel();
        this.parseStringArray(this.comments, context, currentLevel);
    }

    public evaluate(): any {
        // TODO: implement this.
    }

}
