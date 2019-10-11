/**
 * Represents (static)? for function declaration
 */
import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";

export default class StaticDecl extends AstNode {

    isStatic: boolean = false;

    public parse(context: Tokenizer): any {
        if (context.checkToken("static")) {
            this.isStatic = true;
            context.getNext();
        }
    }

    public evaluate(): any {
        // TODO: implement this.
    }

    public typeCheck(): void {

    }

    public fulfillContract(): void {

    }
}
