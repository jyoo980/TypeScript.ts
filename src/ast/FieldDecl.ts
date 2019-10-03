import {VarList} from "./VarList";
import {AstNode} from "./AstNode";

/**
 * Represents a field declaration in the TypeScript DSL.
 *
 * e.g. fields modifier [string bar, boolean baz]
 *
 */
export class FieldDecl extends AstNode {

    fields: VarList;
    modifier: string;
    generateGetter: boolean;
    generateSetter: boolean;

    public parse(): any {
        // TODO: implement the rest.
        this.fields = new VarList();
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}
