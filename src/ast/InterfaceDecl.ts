import {Content} from "./Content";
import {ExtendsDecl} from "./ExtendsDecl";
import {FieldDecl} from "./FieldDecl";
import CommentDecl from "./CommentDecl";
import FuncDecl from "./FuncDecl";
import NodeTable from "./symbols/NodeTable";
import {ImportStringBuilder} from "../util/ImportStringBuilder";
import StaticDecl from "./StaticDecl";
import AsyncDecl from "./AsyncDecl";
import {VarList} from "./VarList";
import {ParseError, Tokenizer} from "../util/Tokenizer";

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

        context.checkStartOfLine();

        if(context.getCurrentLineTabLevel() > indentLevel && context.checkToken("comments")) {
            this.comments = new CommentDecl();
            this.comments.parse(context);
        }

        context.checkStartOfLine();

        if(context.getCurrentLineTabLevel() > indentLevel && context.checkToken("fields")) {
            this.fieldDecl = new FieldDecl();
            this.fieldDecl.isInterfaceField = true;
            this.fieldDecl.parse(context);

            // handle getter/setter functions
            if (this.fieldDecl.generateGetter) {
                this.fieldDecl.fields.nameTypeMap.forEach((name: string, type: string) => {
                    this.functions.push(this.createGetter(name, type));
                });

            }
            if (this.fieldDecl.generateSetter) {
                this.fieldDecl.fields.nameTypeMap.forEach((name: string, type: string) => {
                    this.functions.push(this.createSetter(name, type));
                });
            }
        }

        while(context.getCurrentLineTabLevel() > indentLevel && context.checkToken("function")) {
            context.checkStartOfLine();
            let func: FuncDecl = new FuncDecl();
            func.parse(context);
            this.functions.push(func);
        }

        if(context.getCurrentLineTabLevel() > indentLevel) {
            throw new ParseError(`Invalid keyword: ${context.getNext()}  found under ${this.interfaceName} interface`);
        }

        this.typeTable.addInterface(this.interfaceName);
        NodeTable.getInstance().saveNode(this.interfaceName, this);
        this.pathTable.addTypePath(this.interfaceName, this.getAbsolutePath());
        this.pathTable.addTypePath(this.interfaceName, this.getImportPath());
        return this;
    }

    public evaluate(): any {
        const tsNode = this.engine.createInterface(this);
        const importStr: string = ImportStringBuilder.getImportsString(this);
        const tsNodeAsString: string = this.printer.tsNodeToString(tsNode);
        const tsFileStr: string = `${importStr}\n${tsNodeAsString}`;
        this.fileSystem.generateFile(this.interfaceName, this.parentPath, tsFileStr);
    }

    public typeCheck(): void {
        if (this.extendsNodes !== undefined) {
            this.extendsNodes.typeCheck();
        }
        if(this.extendsNodes) {
            this.extendsNodes.typeCheck();
        }
        if(this.fieldDecl) {
            this.fieldDecl.typeCheck();
        }
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
      
    public getImportPath(): string {
        return `${this.parentPath}/${this.interfaceName}`;
    }

    public getAbsolutePath(): string {
        return this.parentPath + "/" + this.interfaceName + ".ts";
    }

    private createGetter(name: string, type: string): FuncDecl {
        let funcGetter: FuncDecl = new FuncDecl();
        // getName
        funcGetter.name = "get" + name.charAt(0).toUpperCase() + name.slice(1);
        funcGetter.returnDecl.returnType = type;
        funcGetter.modifier = "public";
        funcGetter.maybeStatic = new StaticDecl(); // not static
        funcGetter.maybeAsync = new AsyncDecl(); // not async
        // no params
        funcGetter.params = new VarList();
        funcGetter.comments = new CommentDecl();
        return funcGetter;
    }

    private createSetter(name: string, type: string): FuncDecl {
        let funcSetter: FuncDecl = new FuncDecl();
        // setName
        funcSetter.name = "set" + name.charAt(0).toUpperCase() + name.slice(1);
        funcSetter.returnDecl.returnType = "void";
        funcSetter.modifier = "public";
        funcSetter.maybeStatic = new StaticDecl(); // not static
        funcSetter.maybeAsync = new AsyncDecl(); // not async
        // one param
        funcSetter.params = new VarList();
        funcSetter.params.addPair(name, type);
        funcSetter.comments = new CommentDecl();
        return funcSetter;
    }
}
