import {AstNode} from "./AstNode";
import {VarList} from "./VarList";
import {Tokenizer} from "../util/Tokenizer";
import IVisitor from "../visitor/IVisitor";

/**
 * This represents a constructor as a node in our AST
 *
 * e.g. "constructor" modifier
 *          "params" ParamDecl
 */
export default class ConstructorDecl extends AstNode {

    modifier: string;
    params: VarList;

    public parse(context: Tokenizer): any {
        let indentLevel: number = context.getCurrentLineTabLevel();
        context.getAndCheckNext("constructor");
        this.modifier = context.getNext();

        if (context.getCurrentLineTabLevel() <= indentLevel) return;

        context.getAndCheckNext("params");
        this.params = new VarList();
        this.params.parse(context);
    }

    public evaluate(): any {
        // TODO: implement this.
    }

    public typeCheck(): void {
        this.params.typeCheck();
    }

    public fulfillContract(): void {
        // Not needed.
    }

    public accept(v: IVisitor): void {
        v.visit(this);
    }
}
