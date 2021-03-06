import * as ts from "typescript";
import { TypeNode, SyntaxKind } from "typescript";

export class TypeCheckError extends Error {
    constructor(...args: any[]) {
        super(...args);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Represents a pair which is contains the type e.g. "number", "boolean", "class", "interface"
 * and its TypeNode (from the TS compiler API).
 */
class TypeNodePair {

    pair: [string, TypeNode];
    private typeToSyntaxKind: Map<string, TypeNode> = new Map([
        ["number", ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)],
        ["boolean", ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)],
        ["string", ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)],
        ["void", ts.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)]
    ]);

    constructor(typeName: string, classOrInterface?: string) {
        const maybeKeywordTypeNode: TypeNode = this.typeToSyntaxKind.get(typeName);
        if (maybeKeywordTypeNode !== undefined) {
            this.pair = ["primitive", maybeKeywordTypeNode];
        } else if (classOrInterface === "class") {
            this.pair = ["class", ts.createTypeReferenceNode(typeName, undefined)];
        } else if (classOrInterface === "interface") {
            this.pair = ["interface", ts.createTypeReferenceNode(typeName, undefined)];
        }
    }
}

/**
 * Represents the types we have available in our language. It acts as a basic map from a type name
 * to its "type", i.e. is it a primitive, class, interface?
 *
 * Whenever we declare a new type, we should make a new entry for it in the map.
 */
export class TypeTable {

    table: Map<String, TypeNodePair> = new Map([
        ["number", new TypeNodePair("number")],
        ["boolean", new TypeNodePair("boolean")],
        ["string", new TypeNodePair("string")],
        ["void", new TypeNodePair("void")]
    ]);
    static instance: TypeTable = null;

    private constructor() {

    }

    public static getInstance(): TypeTable {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new TypeTable();
        }
        return this.instance;
    }

    public addClass(name: string): void {
        this.table.set(name, new TypeNodePair(name, "class"));
    }

    public addInterface(name: string): void {
        this.table.set(name, new TypeNodePair(name, "interface"));
    }

    public isValidType(candidate: string): boolean {
        const containedTypes: String[] = [...this.table.keys()];
        return containedTypes.includes(candidate);
    }

    public getTypeNode(name: string): TypeNode {
        const typeNodePair: TypeNodePair = this.table.get(name);
        return typeNodePair.pair[1];
    }

    /**
     * Returns true iff the strings passed in are valid types
     * Could be useful for validating field declarations.
     * @param candidates
     */
    public areValidTypes(candidates: string[]): boolean {
        return candidates.every((candidate) => this.isValidType(candidate));
    }

    // NOTE: Should be used for testing only
    public resetTypeTable() {
        this.table = new Map([
            ["number", new TypeNodePair("number")],
            ["boolean", new TypeNodePair("boolean")],
            ["string", new TypeNodePair("string")],
            ["void", new TypeNodePair("void")]
        ]);
    }
}
