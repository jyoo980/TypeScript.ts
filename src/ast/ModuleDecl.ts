/**
 * Represents the dependencies a TypeScript project may have. Development dependencies by default.
 *
 * e.g. modules ["@types/chai: 4.0.8", "chai: 4.1.2", "mocha: 4.1.0"]
 */
import { Tokenizer } from "../util/Tokenizer";
import { StringArray } from "./StringArray";

export class ModuleDecl extends StringArray {

    modules: string[];

    public parse(context: Tokenizer): any {
        if (!context.getAndCheckNext('modules')) {
            throw new Error('Expected modules keyword');
        };

        this.modules = [];
        const currentLevel = context.getCurrentLineTabLevel();
        this.parseStringArray(this.modules, context, currentLevel);
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}
