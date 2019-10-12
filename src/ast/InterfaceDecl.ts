import {Content} from "./Content";
import {ExtendsDecl} from "./ExtendsDecl";
import {FieldDecl} from "./FieldDecl";
import CommentDecl from "./CommentDecl";
import FuncDecl from "./FuncDecl";
import {Tokenizer} from "../util/Tokenizer";

/**
 * Represents an Interface a TypeScript project may have.
 *
 * e.g. ‘interface’ str EXT? (nl COMMENT)? (nl FIELD)* (nl FUNC)* nl
 */
export class InterfaceDecl extends Content {
    extendsNodes: ExtendsDecl;
    interfaceName: string;
    comments: CommentDecl;
    fieldDecl: FieldDecl;
    functions: FuncDecl[] = [];

    public parse(context: Tokenizer): any {
        let indentLevel = context.getCurrentLineTabLevel();
        context.getAndCheckNext("interface");
        this.interfaceName = context.getNext();

        if(context.checkToken("extends")) {
            this.extendsNodes = new ExtendsDecl();
            this.extendsNodes.parse(context);
        }

        if(context.getCurrentLineTabLevel() > indentLevel && context.checkToken("comments")) {
            this.comments = new CommentDecl();
            this.comments.parse(context);
        }

        if(context.getCurrentLineTabLevel() > indentLevel && context.checkToken("fields")) {
            this.fieldDecl = new FieldDecl();
            this.fieldDecl.isInterfaceField = true;
            this.fieldDecl.parse(context);
        }

        while(context.getCurrentLineTabLevel() > indentLevel && context.checkToken("function")) {
            let func: FuncDecl = new FuncDecl();
            func.parse(context);
            this.functions.push(func);
        }

        this.typeTable.addInterface(this.interfaceName);
        this.pathTable.addTypePath(this.interfaceName, this.getAbsolutePath());

        return this;
    }

    public evaluate(): any {
        const tsNode = this.engine.createInterface(this);
        const tsNodeAsString: string = this.printer.tsNodeToString(tsNode);
        this.fileSystem.generateFile(this.interfaceName, this.parentPath, tsNodeAsString);
    }

    public typeCheck(): void {
        if(this.extendsNodes) {
            this.extendsNodes.typeCheck();
        }
        if(this.fieldDecl) {
            this.fieldDecl.typeCheck();
        }

        this.functions.forEach((funcDecl: FuncDecl) => funcDecl.typeCheck());
    }

    public getAbsolutePath(): string {
        return this.parentPath + "/" + this.interfaceName + ".ts";
    }
}
