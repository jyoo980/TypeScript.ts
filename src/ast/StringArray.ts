import { AstNode } from "./AstNode";
import { Tokenizer } from "../util/Tokenizer";

export abstract class StringArray extends AstNode {
    protected parseStringArray(arr: string[], context: Tokenizer, currentLevel?: number): void {
        context.getAndCheckNext('\\[');
        while (!context.checkToken('\\]')) {
            if (currentLevel && currentLevel > context.getCurrentLineTabLevel()) {
                throw new Error('Bad indent');
            }

            context.getAndCheckNext("\"");
            arr.push(context.getNext());
            context.getAndCheckNext("\"");
            if (!context.checkToken(",")) {
                break;
            }
            context.getAndCheckNext(",");
        }
        context.getAndCheckNext('\\]');
    }
}