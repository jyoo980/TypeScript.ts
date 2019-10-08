import {AstNode} from "./AstNode";
import {VarList} from "./VarList";
import CommentDecl from "./CommentDecl";
import {Tokenizer} from "../util/Tokenizer";

/**
 * Represents a function declaration in our language
 *
 * e.g. function modifier (async | static)? str
 *          params []
 *          comments?
 *          (return TYPE)?
 */
export default class FuncDecl extends AstNode {

    modifier: string;
    isAsync: boolean = false;
    isStatic: boolean = false;
    name: string;
    params: VarList;
    comment: CommentDecl;
    returnType: string;

    public parse(context: Tokenizer): any {
        let indentLevel: number = context.getCurrentLineTabLevel();
        context.getAndCheckNext("function");
        this.modifier = context.getNext();
        const modifierOrName = context.getNext();
        if (this.isModifier(modifierOrName)) {
            this.parseAfterModifier(context, modifierOrName, indentLevel);
        } else {
            this.parseNoModifiers(context, modifierOrName, indentLevel);
        }
    }

    private parseAfterModifier(context: Tokenizer, modifier: string, indentLevel: number): any {
        if (modifier === "static") {
            this.isStatic = true;
        } else {
            this.isAsync = true;
        }
        this.name = context.getNext();
        // TODO
    }

    private parseNoModifiers(context: Tokenizer, name: string, indentLevel: number): any {
        this.name = name;
        if (context.getCurrentLineTabLevel() <= indentLevel) return;
        context.getAndCheckNext("params");
        this.params = new VarList();
        this.params.parse(context);

        const commentOrReturn = context.getNext();
        if (commentOrReturn === "comments") {
            this.comment = new CommentDecl();
            // TODO: parse return (if it has any)
        } else if (commentOrReturn === "returns") {
            this.returnType = context.getNext();
            this.comment = null;
            return;
        }
        this.comment = null;
        this.returnType = "void";
    }

    private isModifier(modifierOrName: string): boolean {
        return (modifierOrName === "async" || modifierOrName === "static");
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}
