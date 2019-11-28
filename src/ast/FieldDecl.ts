import {VarList} from "./VarList";
import {ParseError, Tokenizer} from "../util/Tokenizer";
import {ValidationError} from "./errors/ASTErrors";
import {AstNode} from "./AstNode";
import IVisitor from "../visitor/IVisitor";

/**
 * Represents a field declaration in the TypeScript DSL.
 *
 * e.g. fields modifier [string bar, boolean baz]
 *
 */
export class FieldDecl extends AstNode {

    fields: VarList;
    modifier: string;
    isInterfaceField: boolean = false;
    generateGetter: boolean = false;
    generateSetter: boolean = false;

    public parse(context: Tokenizer): any {
        let indentLevel: number = context.getCurrentLineTabLevel();
        context.getAndCheckNext("fields");
        this.modifier = context.getNext();
        this.fields = new VarList();
        this.fields.parse(context);

        if (context.getCurrentLineTabLevel() <= indentLevel) {
            return;
        }

        context.getAndCheckNext("generate");
        this.parseGetterSetter(context);

        if (context.getCurrentLineTabLevel() <= indentLevel) {
            return;
        }

        context.getAndCheckNext("generate");
        this.parseGetterSetter(context);
    }

    private parseGetterSetter(context: Tokenizer) {
        const maybeGetterSetter = context.getNext();
        if (maybeGetterSetter === "getters") {
            this.generateGetter = true;
        } else if (maybeGetterSetter === "setters") {
            this.generateSetter = true;
        } else {
            throw new ParseError(`FieldDecl::failed to parse getter/setter`);
        }
    }

    public evaluate(): any {
        // TODO: implement this.
    }

    public typeCheck(): void {
        if(this.isInterfaceField && this.modifier !== "public") {
            throw new ValidationError("Interfaces cannot have non-public fields");
        }
        this.fields.typeCheck();
    }

    public fulfillContract(): void {
        // Not needed.
    }

    public accept(v: IVisitor): void {
        v.visitFieldDecl(this);
    }
}
