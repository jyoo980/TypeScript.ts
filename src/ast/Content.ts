import {AstNode} from "./AstNode";

/**
 * Represents content that can be inside a dir:
 *  - Class
 *  - Interface
 *  - Nested dir
 *
 * e.g. DIR | CLASS| INTERFACE
 */
export abstract class Content extends AstNode {}
