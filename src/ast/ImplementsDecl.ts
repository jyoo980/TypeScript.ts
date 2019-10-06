/**
 * Represents an implements inheritance relationship.
 *
 * e.g. 'implements' <type> (',' <type>)*
 */
import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";

export class ImplementsDecl extends AstNode {
    parentNames: string[];


    public parse(context: Tokenizer): any {
        context.getAndCheckNext("implements");
        this.parentNames = [];
        this.parentNames.push(context.getNext());

        // TODO: implement the rest of this
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}