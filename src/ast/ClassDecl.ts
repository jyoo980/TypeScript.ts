import {Content} from "./Content";
import {FieldDecl} from "./FieldDecl";
import {ExtendsDecl} from "./ExtendsDecl";
import {ImplementsDecl} from "./ImplementsDecl";
import CommentDecl from "./CommentDecl";
import FuncDecl from "./FuncDecl";
import {Tokenizer} from "../util/Tokenizer";
import {ImportStringBuilder} from "../util/ImportStringBuilder";

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
        const importStr: string = ImportStringBuilder.getImportsString(this);
        const tsNodeStr: string = this.printer.tsNodeToString(this.engine.createClass(this));
        const tsFileStr: string = `${importStr}\n${tsNodeStr}`;
        this.fileSystem.generateFile(this.className, this.parentPath, tsFileStr);
    }

    public typeCheck(): void {
        if (this.extendsNodes !== undefined) {
            this.extendsNodes.typeCheck();
        }
        this.fields.forEach((fieldDecl: FieldDecl) => fieldDecl.typeCheck());
        this.functions.forEach((funcDecl: FuncDecl) => funcDecl.typeCheck());
    }

    public getAbsolutePath(): string {
        return `${this.parentPath}/${this.className}.ts`;
    }
}
