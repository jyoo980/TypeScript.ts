import {VarList} from "./VarList";
import {AstNode} from "./AstNode";
import {Tokenizer} from "../util/Tokenizer";

/**
 * Represents a field declaration in the TypeScript DSL.
 *
 * e.g. fields modifier [string bar, boolean baz]
 *
 */
export class FieldDecl extends AstNode {

    fields: VarList;
    modifier: string;
    generateGetter: boolean = false;
    generateSetter: boolean = false;

    public parse(context: Tokenizer): any {
        let indentLevel: number = context.getCurrentLineTabLevel();
        context.getAndCheckNext("fields");
        this.modifier = context.getNext();
        this.fields = new VarList();
        this.fields.parse(context);

        context.getNext();

        if (context.getCurrentLineTabLevel() <= indentLevel) {
            return;
        }

        context.getAndCheckNext("generate");

        if (context.getNext() === "getter") {
            this.generateGetter = true;
        } else {
            this.generateSetter = true;
        }

        context.getNext();

        if (context.getCurrentLineTabLevel() <= indentLevel) {
            return;
        }

        if (this.generateSetter) {
            this.generateGetter = true
        } else {
            this.generateSetter = true;
        }
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}
