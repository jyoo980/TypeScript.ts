/**
 * Represents the dependencies a TypeScript project may have. Development dependencies by default.
 *
 * e.g. modules ["chai: 4.1.2", "mocha"]
 */
import { AstNode } from "./AstNode";
import { Tokenizer } from "../util/Tokenizer";

export class ModuleDecl extends AstNode {

    modules: string[] = [];

    public parse(context: Tokenizer): any {
        if (!context.checkToken('modules')) {
            throw new Error('Expected modules keyword');
        };
        context.getNext();

        const currentLevel = context.getCurrentLineTabLevel();
        context.getAndCheckNext('\\[');
        while (!context.checkToken('\\]')) {
            if (currentLevel && currentLevel > context.getCurrentLineTabLevel()) {
                throw new Error('Bad indent');
            }

            context.getAndCheckNext("\"");
            this.modules.push(context.getNext());
            context.getAndCheckNext("\"");
            if (!context.checkToken(",")) {
                break;
            }
            context.getAndCheckNext(",");
        }
        context.getAndCheckNext('\\]');
    }

    public evaluate(): any {
        // TODO: implement this.
    }

    public typeCheck(): void {
        // Not needed.
    }

    public fulfillContract(): void {
        // Not needed.
    }
}
