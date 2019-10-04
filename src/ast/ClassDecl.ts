import {Content} from "./Content";
import {FieldDecl} from "./FieldDecl";
import {ExtendsDecl} from "./ExtendsDecl";
import {ImplementsDecl} from "./ImplementsDecl";
import CommentDecl from "./CommentDecl";
import FuncDecl from "./FuncDecl";

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


    public parse(): any {
        this.isAbstract = this.tokenizer.checkToken("abstract");
        this.tokenizer.getAndCheckNext("class");
        this.className = this.tokenizer.getNext();

        if(this.tokenizer.checkToken("implements")) {
            this.implementsNodes = new ImplementsDecl();
            this.implementsNodes.parse();
        }

        if(this.tokenizer.checkToken("extends")) {
            this.extendsNodes = new ExtendsDecl();
            this.extendsNodes.parse();
        }

        // TODO: implement the rest of this
        this.comments = new CommentDecl();
        this.comments.parse();

        this.fields = [];
        this.fields.forEach((field) => {
            field.parse();
        });

        this.functions = [];
        this.functions.forEach((fn) => {
            fn.parse();
        });
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}
