import {Content} from "./Content";
import {ExtendsDecl} from "./ExtendsDecl";
import {FieldDecl} from "./FieldDecl";
import CommentDecl from "./CommentDecl";
import FuncDecl from "./FuncDecl";
import {Tokenizer} from "../util/Tokenizer";
import NodeTable from "./symbols/NodeTable";
import {AstNode} from "./AstNode";
import {VarList} from "./VarList";

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
            // TODO: how do we want to handle if someone tries to declare private fields in an interface?
            this.fieldDecl = new FieldDecl();
            this.fieldDecl.parse(context);
        }

        while(context.getCurrentLineTabLevel() > indentLevel && context.checkToken("function")) {
            let func: FuncDecl = new FuncDecl();
            func.parse(context);
            this.functions.push(func);
        }

        this.typeTable.addInterface(this.interfaceName);
        NodeTable.getInstance().saveNode(this.interfaceName, this);
    }

    public evaluate(): any {
        const tsNode = this.engine.createInterface(this);
        const tsNodeAsString: string = this.printer.tsNodeToString(tsNode);
        this.fileSystem.generateFile(this.interfaceName, this.parentPath, tsNodeAsString);
    }

    public typeCheck(): void {
        this.extendsNodes.typeCheck();
        this.fieldDecl.typeCheck();
        this.functions.forEach((funcDecl: FuncDecl) => funcDecl.typeCheck());
    }

    public fulfillContract(): void {
        if (this.extendsNodes !== undefined) {
            const parentNode: InterfaceDecl =
                NodeTable.getInstance().getNode(this.extendsNodes.parentName) as InterfaceDecl;
            this.addParentFunctions(parentNode);
            this.addParentFields(parentNode);

        }
    }

    private addParentFunctions(parentNode: InterfaceDecl): void {
        this.functions = this.functions.concat(parentNode.functions)
    }

    private addParentFields(parentNode: InterfaceDecl): void {
        if (parentNode.fieldDecl !== undefined) {
            if (this.fieldDecl === undefined) {
                this.fieldDecl = new FieldDecl();
                this.fieldDecl.fields = new VarList();
            }
            this.fieldDecl.fields.appendVarList(parentNode.fieldDecl.fields);
        }
    }
}
