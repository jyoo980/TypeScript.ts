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
        this.isAbstract = context.checkToken("abstract");
        context.getAndCheckNext("class");
        this.className = context.getNext();

        if(context.checkToken("implements")) {
            this.implementsNodes = new ImplementsDecl();
            this.implementsNodes.parse();
        }

        if(context.checkToken("extends")) {
            this.extendsNodes = new ExtendsDecl();
            this.extendsNodes.parse(context);
        }

        // TODO: implement the rest of this
        this.comments = new CommentDecl();
        this.comments.parse(context);

        this.fields = [];
        this.fields.forEach((field) => {
            field.parse(context);
        });

        this.functions = [];
        this.functions.forEach((fn) => {
            fn.parse(context);
        });
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}
