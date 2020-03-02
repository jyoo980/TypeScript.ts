import { AstNode } from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";
import {TypeCheckError} from "./symbols/TypeTable";
import Visitor from "../codegen/Visitor";

/**
 * Represents a list of fields and their corresponding type. Used in declaring fields.
 *
 * e.g. [string foo, boolean bar, IInsightFacade baz]
 */
export class VarList extends AstNode {

    nameTypeMap: Map<string, string> = new Map();

    public addPair(name: string, type: string): void {
        this.nameTypeMap.set(name, type);
    }

    public parse(context: Tokenizer): any {
        // See the beginning of the array "["
        context.getAndCheckNext("^[\\[]$");
        while (!context.checkToken("^[\\]]$")) {
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

    public appendVarList(otherVars: VarList): void {
        const fieldsAsList: [string, string][] = [...otherVars.nameTypeMap.entries()];
        fieldsAsList.forEach((nameTypePair) => {
            this.nameTypeMap.set(nameTypePair[0], nameTypePair[1]);
        });
    }

    public accept(v: Visitor): void {
        v.visitVarList(this);
    }
}
