/**
 * Represents (RETURN type)? for function declaration
 */
import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";

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
}
