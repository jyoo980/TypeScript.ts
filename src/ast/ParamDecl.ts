import {AstNode} from "./AstNode";
import {VarList} from "./VarList";

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
