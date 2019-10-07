import { AstNode } from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";

/**
 * Represents a list of fields and their corresponding type. Used in declaring fields.
 *
 * e.g. [string foo, boolean bar, IInsightFacade baz]
 */
export class VarList extends AstNode {

    nameToType: Map<string, string>;

    public addPair(name: string, type: string): void {
        this.nameToType.set(name, type);
    }

    public parse(context: Tokenizer): any {
        this.nameToType = new Map();
        context.getAndCheckNext("\\[");
        while (!context.checkToken("\\]")) {
            const type: string = context.getNext();
            const name: string = context.getNext();
            this.addPair(type, name);
            if (!context.checkToken(",")) {
                break;
            }
            context.getAndCheckNext(",");
        }
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}
