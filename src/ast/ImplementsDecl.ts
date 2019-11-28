/**
 * Represents an implements inheritance relationship.
 *
 * e.g. 'implements' <type> (',' <type>)*
 */
import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";
import IVisitor from "../visitor/IVisitor";

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
        // Not needed.
    }

    public typeCheck(): void {
        const allValidTypes: boolean = this.typeTable.areValidTypes(this.parentNames);
        if (!allValidTypes) {
            throw new TypeError(`At least one type from: ${this.parentNames} was not declared`);
        }
    }

    public fulfillContract(): void {
        // Not needed.
    }

    public accept(v: IVisitor): void {
        v.visitImplementsDecl(this);
    }
}
