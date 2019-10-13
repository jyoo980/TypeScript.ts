/**
 * Represents (RETURN type)? for function declaration
 */
import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";
import {TypeCheckError} from "./symbols/TypeTable";

export default class ReturnDecl extends AstNode {

    returnType: string;

    public parse(context: Tokenizer): any {
        if (context.checkToken("returns")) {
            context.getNext();
            this.returnType = context.getNext();
        } else {
            this.returnType = "void";
        }
    }

    public evaluate(): any {

    }

    public typeCheck(): void {
        const wasDeclared: boolean = this.typeTable.isValidType(this.returnType.replace(/[\[\]]/g, ""));
        if (!wasDeclared) {
            throw new TypeCheckError(`Type: ${this.returnType} was not defined`);
        }
    }

    public fulfillContract(): void {
        // Not needed.
    }
}
