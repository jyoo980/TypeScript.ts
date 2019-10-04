/**
 * Represents an extends inheritance relationship.
 *
 * e.g. 'extends' <type>
 */
import {AstNode} from "./AstNode";

export class ExtendsDecl extends AstNode {
    parentName: string;


    public parse(): any {
        this.tokenizer.getAndCheckNext("extends");
        this.parentName = this.tokenizer.getNext();
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}