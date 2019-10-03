import { AstNode } from "./AstNode";

/**
 * Represents a list of fields and their corresponding type. Used in declaring fields.
 *
 * e.g. [string foo, boolean bar, IInsightFacade baz]
 */
export class VarList extends AstNode {

    nameToType: Map<string, string>;

    public addPair(name: string, type: string): void {
        this.nameToType.set(name, type);
    }

    public getVars(): String[] {
        return Array.from(this.nameToType.keys());
    }

    public parse(): any {
        // TODO: implement the rest.
        this.nameToType = new Map();
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}
