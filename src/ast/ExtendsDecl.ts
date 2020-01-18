/**
 * Represents an extends inheritance relationship.
 *
 * e.g. 'extends' <type>
 */
import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";
import {TypeCheckError} from "./symbols/TypeTable";
import Visitor from "../codegen/Visitor";

export class ExtendsDecl extends AstNode {
    parentName: string;


    public parse(context: Tokenizer): any {
        context.getAndCheckNext("extends");
        this.parentName = context.getNext();
        return this;
    }

    public accept(v: Visitor): void {
        v.visitExtendsDecl(this);
    }
}
