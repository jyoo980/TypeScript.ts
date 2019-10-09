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
 *          (generate getter)?
 *          (generate setter)?
 *          (return TYPE)?
 */
export default class FuncDecl extends AstNode {

    modifier: string;
    isAsync: boolean;
    isStatic: boolean;
    name: string;
    params: VarList;
    comments: CommentDecl;
    generateGetter: boolean;
    generateSetter: boolean;
    returnType: string;

    public parse(context: Tokenizer): any {
        this.params = new VarList();
        this.comments = new CommentDecl();
        // TODO: implement the rest.
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}
