/**
 * Represents (async)? for function declaration
 */
import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";

export default class AsyncDecl extends AstNode {

    isAsync: boolean = false;

    public parse(context: Tokenizer): any {
        if (context.checkToken("async")) {
            this.isAsync = true;
            context.getNext();
        }
    }

    public evaluate(): any {

    }

    public typeCheck(): void {

    }

    public fulfillContract(): void {

    }

}
