import {Content} from "./Content";
import {FieldDecl} from "./FieldDecl";
import {ExtendsDecl} from "./ExtendsDecl";
import {ImplementsDecl} from "./ImplementsDecl";
import CommentDecl from "./CommentDecl";
import FuncDecl from "./FuncDecl";
import {Tokenizer} from "../util/Tokenizer";
import NodeTable from "./symbols/NodeTable";
import {InterfaceDecl} from "./InterfaceDecl";
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
        NodeTable.getInstance().saveNode(this.className, this);
        this.pathTable.addTypePath(this.className, this.getAbsolutePath());
        return this;
    }

    public evaluate(): any {
        const tsNodeStr: string = this.printer.tsNodeToString(this.engine.createClass(this));
        this.fileSystem.generateFile(this.className, this.parentPath, tsNodeStr);
    }

    public typeCheck(): void {
        this.extendsNodes.typeCheck();
        this.fields.forEach((fieldDecl: FieldDecl) => fieldDecl.typeCheck());
        this.functions.forEach((funcDecl: FuncDecl) => funcDecl.typeCheck());
    }

    public fulfillContract(): void {
        const nodeTable: NodeTable = NodeTable.getInstance();
        if (this.implementsNodes !== undefined) {
            const interfacesToImplement: string[] = this.implementsNodes.parentNames;
            interfacesToImplement.forEach((parentName) => {
                const interfaceDecl: InterfaceDecl = nodeTable.getNode(parentName) as InterfaceDecl;
                this.implementInterface(interfaceDecl);
            });
        }
    }

    private implementInterface(interfaceDecl: InterfaceDecl): void {
        this.functions = this.functions.concat(interfaceDecl.functions);
        if (interfaceDecl.fieldDecl !== undefined) {
            this.fields.push(interfaceDecl.fieldDecl);
        }

    public getAbsolutePath(): string {
        return `${this.parentPath}/${this.className}.ts`;
    }
}
