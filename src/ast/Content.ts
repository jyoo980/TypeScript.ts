import {AstNode} from "./AstNode";

/**
 * Represents content that can be inside a dir:
 *  - Class
 *  - Interface
 *  - Nested dir
 *
 * e.g. DIR | CLASS| INTERFACE
 */
export abstract class Content extends AstNode {
    // Path to this directory, class or interface file
    parentPath: string;

    public constructor(parentPath: string) {
        super();
        this.parentPath = parentPath;
    }

    public abstract getAbsolutePath(): string;
}
