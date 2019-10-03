import {AstNode} from "./AstNode";
import {VarList} from "./VarList";

/**
 * This represents a constructor as a node in our AST
 *
 * e.g. "constructor" modifier
 *          "params" ParamDecl
 */
export default class ConstructorDecl extends AstNode {

    modifier: string;
    params: VarList;

    public parse(): any {
        this.params = new VarList();
        // TODO: implement the rest.
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}
