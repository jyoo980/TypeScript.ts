import {Content} from "./Content";
import {FieldDecl} from "./FieldDecl";
import {ExtendsDecl} from "./ExtendsDecl";
import {ImplementsDecl} from "./ImplementsDecl";
import CommentDecl from "./CommentDecl";
import FuncDecl from "./FuncDecl";
import {Tokenizer} from "../util/Tokenizer";

/**
 * Represents a Class a TypeScript project may have.
 *
 * e.g. ABS? ‘class’ str IMP? EXT? (nl COMMENT)? (nl FIELD)* (nl FUNC)* nl
 */
export class ClassDecl extends Content {
    isAbstract: boolean;
    className: string;
    implementsNodes: ImplementsDecl;
    extendsNodes: ExtendsDecl;
    comments: CommentDecl;
    fields: FieldDecl[];
    functions: FuncDecl[];


    public parse(context: Tokenizer): any {
        let indentLevel: number = context.getCurrentLineTabLevel();
        this.isAbstract = context.checkToken("abstract");
        context.getAndCheckNext("class");
        this.className = context.getNext();

        if(context.checkToken("implements")) {
            this.implementsNodes = new ImplementsDecl();
            this.implementsNodes.parse(context);
        }

        if(context.checkToken("extends")) {
            this.extendsNodes = new ExtendsDecl();
            this.extendsNodes.parse(context);
        }

        if(context.getCurrentLineTabLevel() <= indentLevel) {
            return;
        }

        if(context.checkToken("comments")) {
            this.comments = new CommentDecl();
            this.comments.parse(context);
        }

        if(context.getCurrentLineTabLevel() > indentLevel) {
            return;
        }

        this.fields = [];
        while(context.getCurrentLineTabLevel() > indentLevel && context.checkToken("fields")) {
            let field: FieldDecl = new FieldDecl();
            field.parse(context);
            this.fields.push(field);
        }

        this.functions = [];
        while(context.getCurrentLineTabLevel() > indentLevel && context.checkToken("functions")) {
            let func: FuncDecl = new FuncDecl();
            func.parse(context);
            this.functions.push(func);
        }
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}
