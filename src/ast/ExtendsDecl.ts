/**
 * Represents an extends inheritance relationship.
 *
 * e.g. 'extends' <type>
 */
import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";
import {TypeCheckError} from "./symbols/TypeTable";

export class ExtendsDecl extends AstNode {
    parentName: string;


    public parse(context: Tokenizer): any {
        context.getAndCheckNext("extends");
        this.parentName = context.getNext();
        return this;
    }

    public evaluate(): any {
        // TODO: implement this.
    }

    public typeCheck(): void {
        const wasDeclared: boolean = this.typeTable.isValidType(this.parentName);
        if (!wasDeclared) {
            throw new TypeCheckError(`Type: ${this.parentName} was not defined`);
        }
    }
}
