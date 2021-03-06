/**
 * Represents (RETURN type)? for function declaration
 */
import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";
import {TypeCheckError} from "./symbols/TypeTable";
import Visitor from "../codegen/Visitor";

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

    public accept(v: Visitor): void {
        v.visitReturnDecl(this);
    }
}
