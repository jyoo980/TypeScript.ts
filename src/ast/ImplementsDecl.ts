/**
 * Represents an implements inheritance relationship.
 *
 * e.g. 'implements' <type> (',' <type>)*
 */
import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";
import Visitor from "../codegen/Visitor";

export class ImplementsDecl extends AstNode {
    parentNames: string[];


    public parse(context: Tokenizer): any {
        context.getAndCheckNext("implements");
        this.parentNames = [];
        this.parentNames.push(context.getNext());

        while(context.checkToken("\,")) {
            context.getNext();
            this.parentNames.push(context.getNext());
        }
        return this;
    }

    public accept(v: Visitor): void {
        v.visitImplementsDecl(this);
    }
}
