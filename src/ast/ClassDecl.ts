import {Content} from "./Content";
import {FieldDecl} from "./FieldDecl";
import {ExtendsDecl} from "./ExtendsDecl";
import {ImplementsDecl} from "./ImplementsDecl";
import CommentDecl from "./CommentDecl";
import FuncDecl from "./FuncDecl";
import {Tokenizer} from "../util/Tokenizer";
import StaticDecl from "./StaticDecl";
import AsyncDecl from "./AsyncDecl";
import {VarList} from "./VarList";
import Func = Mocha.Func;

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
            if (field.generateGetter) {
                field.fields.nameTypeMap.forEach((type: string, name: string) => {
                    this.functions.push(this.createGetter(name, type));
                });

            }
            if (field.generateSetter) {
                field.fields.nameTypeMap.forEach((type: string, name: string) => {
                    this.functions.push(this.createSetter(name, type));
                });
            }
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
        const tsNodeStr: string = this.printer.tsNodeToString(this.engine.createClass(this));
        this.fileSystem.generateFile(this.className, this.parentPath, tsNodeStr);
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

    private createGetter(name: string, type: string): FuncDecl {
        let funcGetter: FuncDecl = new FuncDecl();
        funcGetter.name = "get" + name.charAt(0).toUpperCase() + name.slice(1);
        funcGetter.returnDecl.returnType = type;
        funcGetter.modifier = "public";
        funcGetter.maybeStatic = new StaticDecl(); // not static
        funcGetter.maybeAsync = new AsyncDecl(); // not async
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
        funcSetter.params = new VarList();
        funcSetter.params.addPair(name, type);
        funcSetter.comments = new CommentDecl();
        return funcSetter;
    }
}
