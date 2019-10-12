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
    isAbstract: boolean = false;
    className: string;
    implementsNodes: ImplementsDecl;
    extendsNodes: ExtendsDecl;
    comments: CommentDecl;
    fields: FieldDecl[] = [];
    functions: FuncDecl[] = [];

    public parse(context: Tokenizer): any {
        let indentLevel: number = context.getCurrentLineTabLevel();
        if(context.checkToken("abstract")) {
            context.getNext();
            this.isAbstract = true;
        }

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

        if(context.getCurrentLineTabLevel() > indentLevel && context.checkToken("comments")) {
            this.comments = new CommentDecl();
            this.comments.parse(context);
        }

        while(context.getCurrentLineTabLevel() > indentLevel && context.checkToken("fields")) {
            let field: FieldDecl = new FieldDecl();
            field.parse(context);
            this.fields.push(field);
        }

        while(context.getCurrentLineTabLevel() > indentLevel && context.checkToken("function")) {
            let func: FuncDecl = new FuncDecl();
            func.parse(context);
            this.functions.push(func);
        }

        this.typeTable.addClass(this.className);
        this.pathTable.addTypePath(this.className, this.getAbsolutePath());

        return this;
    }

    public evaluate(): any {
        // TODO: implement this.
    }

    public typeCheck(): void {
        this.extendsNodes.typeCheck();
        this.fields.forEach((fieldDecl: FieldDecl) => fieldDecl.typeCheck());
        this.functions.forEach((funcDecl: FuncDecl) => funcDecl.typeCheck());
    }

    public getAbsolutePath(): string {
        return `${this.parentPath}/${this.className}.ts`;
    }
}
