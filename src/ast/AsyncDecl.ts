/**
 * Represents (async)? for function declaration
 */
import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";
import Visitor from "../codegen/Visitor";

export default class AsyncDecl extends AstNode {

    isAsync: boolean = false;

    public parse(context: Tokenizer): any {
        if (context.checkToken("async")) {
            this.isAsync = true;
            context.getNext();
        }
    }

    public accept(v: Visitor): void {
        v.visitAsyncDecl(this);
    }

}
