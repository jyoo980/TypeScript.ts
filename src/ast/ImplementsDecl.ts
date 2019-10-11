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

        while(context.checkToken("\,")) {
            context.getNext();
            this.parentNames.push(context.getNext());
        }
        return this;
    }

    public evaluate(): any {
        // TODO: implement this.
    }

    public typeCheck(): void {
        const allValidTypes: boolean = this.typeTable.areValidTypes(this.parentNames);
        if (!allValidTypes) {
            throw new TypeError(`At least one type from: ${this.parentNames} was not declared`);
        }
    }
}
