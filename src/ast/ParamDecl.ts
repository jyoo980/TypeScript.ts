import {AstNode} from "./AstNode";
import {VarList} from "./VarList";

/**
 * Represents a parameter declaration AST node
 *
 * Take a look at the VarList class to see how this works, basically looks like
 *
 * [<type> name, <type> name, etc...]
 */
export default class ParamDecl extends AstNode {

    params: VarList;

    public parse(): any {
        // TODO: implement the rest.
        this.params = new VarList();
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}
