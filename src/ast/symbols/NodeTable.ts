/**
 * This is a map from a type to their Ast representation.
 * Useful for when we have a class that extends/implements another class or interface
 * and we want them to own properties from their parent.
 *
 * The only kind of entries here should be
 *  className     -> ClassDecl (AstNode)
 *  interfaceName -> InterfaceDecl (AstNode)
 */
import {AstNode} from "../AstNode";

export default class NodeTable {

    public static instance: NodeTable = undefined;
    private nameToNode: Map<string, AstNode>;

    private constructor() {
        this.nameToNode = new Map();
    }

    public static getInstance(): NodeTable {
        if (this.instance === undefined) {
            this.instance = new NodeTable();
        }
        return this.instance;
    }

    public getNode(typeName: string): AstNode {
        return this.nameToNode.get(typeName);
    }

    public saveNode(typeName: string, astNode: AstNode): void {
        this.nameToNode.set(typeName, astNode);
    }
}
