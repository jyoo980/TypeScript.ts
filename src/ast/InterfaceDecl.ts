import {Content} from "./Content";
import {ExtendsDecl} from "./ExtendsDecl";
import {FieldDecl} from "./FieldDecl";
import CommentDecl from "./CommentDecl";
import FuncDecl from "./FuncDecl";

/**
 * Represents an Interface a TypeScript project may have.
 *
 * e.g. ‘interface’ str EXT? (nl COMMENT)? (nl FIELD)* (nl FUNC)* nl
 */
export class InterfaceDecl extends Content {
    extendsNodes: ExtendsDecl;
    interfaceName: string;
    comments: CommentDecl;
    fields: FieldDecl[];
    functions: FuncDecl[];



    public parse(): any {
        this.tokenizer.getAndCheckNext("interface");
        this.interfaceName = this.tokenizer.getNext();

        if(this.tokenizer.checkToken("extends")) {
            this.extendsNodes = new ExtendsDecl();
        }

        // TODO: implement the rest of this.
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