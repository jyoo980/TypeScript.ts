/**
 * Represents (static)? for function declaration
 */
import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";
import IVisitor from "../visitor/IVisitor";

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

    public fulfillContract(): void {
        // Not needed.
    }

    public accept(v: IVisitor): void {
        v.visitStaticDecl(this);
    }
}
