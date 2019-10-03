/**
 * Represents the directories a TypeScript project may have.
 *
 * e.g. dir str (DIR | CLASS| INTERFACE)+
 */
import {AstNode} from "./AstNode";

export class DirDecl extends AstNode {

    directory: string;
    // TODO: add members for the nested directory or class or interface

    public parse(): any {
        // TODO: implement this.
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}
