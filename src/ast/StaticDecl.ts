/**
 * Represents (static)? for function declaration
 */
import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";
import Visitor from "../codegen/Visitor";

export default class StaticDecl extends AstNode {

    isStatic: boolean = false;

    public parse(context: Tokenizer): any {
        if (context.checkToken("static")) {
            this.isStatic = true;
            context.getNext();
        }
    }

    public evaluate(): any {
        // Not needed.
    }

    public typeCheck(): void {
        // Not needed.
    }

    public accept(v: Visitor): void {
        v.visitStaticDecl(this);
    }
}
