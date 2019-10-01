import * as ts from "typescript";
import { TypeNode } from "typescript";

/**
 * Represents the types we have available in our language. It acts as a basic map from a type name
 * to its "type", i.e. is it a primitive, class, interface?
 *
 * Whenever we declare a new type, we should make a new entry for it in the map.
 */
export class TypeTable {

    // TODO: consider whether this needs to be a singleton
    table: Map<String, TypeNode>;

    constructor() {
        this.table = new Map();
        this.table.set("number", ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword));
        this.table.set("boolean", ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword));
        this.table.set("string", ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword));
    }

    public addClass(name: string): void {
        this.table.set(name, ts.createTypeReferenceNode(name, undefined));
    }

    public addInterface(name: string): void {
        this.table.set(name, ts.createTypeReferenceNode(name, undefined));
    }

    public isValidType(candidate: string): boolean {
        const containedTypes: String[] = Array.from(this.table.keys());
        return containedTypes.includes(candidate);
    }

    /**
     * Returns true iff the strings passed in are valid types
     * Could be useful for validating field declarations.
     * @param candidates
     */
    public areValidTypes(candidates: string[]): boolean {
        return candidates.reduce((acc, val) => {
            return this.isValidType(val);
        }, false);
    }
}
