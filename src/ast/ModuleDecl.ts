/**
 * Represents the dependencies a TypeScript project may have. Development dependencies by default.
 *
 * e.g. modules ["@types/chai: 4.0.8", "chai: 4.1.2", "mocha: 4.1.0"]
 */
import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";

export class ModuleDecl extends AstNode {

    modules: string[];

    public parse(context: Tokenizer): any {
        // TODO: implement the rest.
        this.modules = [];
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}
