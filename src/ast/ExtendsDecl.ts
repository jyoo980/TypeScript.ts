/**
 * Represents an extends inheritance relationship.
 *
 * e.g. 'extends' <type>
 */
import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";

export class ExtendsDecl extends AstNode {
    parentName: string;


    public parse(context: Tokenizer): any {
        context.getAndCheckNext("extends");
        this.parentName = context.getNext();
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}