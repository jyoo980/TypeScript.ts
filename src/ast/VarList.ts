import { AstNode } from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";
import {TypeCheckError} from "./symbols/TypeTable";

/**
 * Represents a list of fields and their corresponding type. Used in declaring fields.
 *
 * e.g. [string foo, boolean bar, IInsightFacade baz]
 */
export class VarList extends AstNode {

    nameToType: Map<string, string> = new Map();

    public addPair(name: string, type: string): void {
        this.nameToType.set(name, type);
    }

    public parse(context: Tokenizer): any {
        // See the beginning of the array "["
        context.getAndCheckNext("\\[");
        while (!context.checkToken("\\]")) {
            // Iterate over the type/name pairs until we see the bracket "]
            const type: string = context.getNext();
            const name: string = context.getNext();
            this.addPair(name, type);
            // If we only have one type/name pair, break
            if (!context.checkToken(",")) {
                break;
            }
            context.getAndCheckNext(",");
        }
        context.getNext();
    }

    public evaluate(): any {
        // TODO: implement this.
    }

    public typeCheck(): void {
        const fieldTypes: string[] = Array.from(this.nameToType.values());
        const allValidTypes: boolean = this.typeTable.areValidTypes(fieldTypes);
        if (!allValidTypes) {
            throw new TypeCheckError(`At least one type from: ${fieldTypes} was not declared`);
        }
    }

    public fulfillContract(): void {

    }
}
