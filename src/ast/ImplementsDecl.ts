/**
 * Represents an implements inheritance relationship.
 *
 * e.g. 'implements' <type> (',' <type>)*
 */
import {AstNode} from "./AstNode";

export class ImplementsDecl extends AstNode {
    parentNames: string[];


    public parse(): any {
        this.tokenizer.getAndCheckNext("implements");
        this.parentNames = [];
        this.parentNames.push(this.tokenizer.getNext());

        // TODO: implement the rest of this
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}