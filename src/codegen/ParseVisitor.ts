import Visitor from "./Visitor";
import {ParseError, Tokenizer} from "../util/Tokenizer";
import AsyncDecl from "../ast/AsyncDecl";
import {ClassDecl} from "../ast/ClassDecl";
import {ImplementsDecl} from "../ast/ImplementsDecl";
import {ExtendsDecl} from "../ast/ExtendsDecl";
import CommentDecl from "../ast/CommentDecl";
import {FieldDecl} from "../ast/FieldDecl";
import FuncDecl from "../ast/FuncDecl";
import NodeTable from "../ast/symbols/NodeTable";
import {TypeTable} from "../ast/symbols/TypeTable";
import {PathTable} from "../util/PathTable";
import ConstructorDecl from "../ast/ConstructorDecl";
import {VarList} from "../ast/VarList";
import {Content} from "../ast/Content";
import {DirDecl} from "../ast/DirDecl";
import {InterfaceDecl} from "../ast/InterfaceDecl";

export default class ParseVisitor extends Visitor {

    private readonly context: Tokenizer;
    private readonly typeTable: TypeTable = TypeTable.getInstance();
    private readonly pathTable: PathTable = PathTable.getInstance();

    constructor(context: Tokenizer) {
        super();
        this.context = context;
    }

    public visitAsyncDecl(node: AsyncDecl): void {
        if (this.context.checkToken("async")) {
            node.isAsync = true;
            this.context.getNext();
        }
    }

    public visitClassDecl(node: ClassDecl): void {
        const indentLevel = this.context.getCurrentLineTabLevel();
        if (this.context.checkToken("abstract")) {
            this.context.getNext();
            node.isAbstract = true;
        }

        this.context.getAndCheckNext("class");
        node.className = this.context.getNext();

        if (this.context.checkToken("implements")) {
            if (node.isAbstract) {
                throw new ParseError("Cannot implement another class in an abstract class");
            }
            node.implementsNodes = new ImplementsDecl();
            node.implementsNodes.accept(this);
        }

        if (this.context.checkToken("extends")) {
            node.extendsNodes = new ExtendsDecl();
            node.extendsNodes.accept(this);
        }

        this.context.checkStartOfLine();

        if (this.context.getCurrentLineTabLevel() > indentLevel && this.context.checkToken("comments")) {
            node.comments = new CommentDecl();
            node.comments.accept(this);
        }

        while (this.context.getCurrentLineTabLevel() > indentLevel && this.context.checkToken("fields")) {
            this.context.checkStartOfLine();
            let field = new FieldDecl();
            field.accept(this);
            if (field.generateGetter) {
                field.fields.nameTypeMap.forEach((type: string, name: string) => {
                    node.functions.push(node.createGetter(name, type));
                });

            }
            if (field.generateSetter) {
                field.fields.nameTypeMap.forEach((type: string, name: string) => {
                    node.functions.push(node.createSetter(name, type));
                });
            }
            node.fields.push(field);
        }

        while (this.context.getCurrentLineTabLevel() > indentLevel && this.context.checkToken("function")) {
            this.context.checkStartOfLine();
            let func: FuncDecl = new FuncDecl();
            func.accept(this);
            node.functions.push(func);
        }

        if (this.context.getCurrentLineTabLevel() > indentLevel) {
            throw new ParseError(`Invalid keyword: ${this.context.getNext()}  found under ${node.className} class`);
        }

        this.typeTable.addClass(node.className);
        NodeTable.getInstance().saveNode(node.className, node);
        this.pathTable.addTypePath(node.className, node.getImportPath());
    }

    public visitCommentDecl(node: CommentDecl): void {
        if (this.context.checkToken("comments")) {
            this.context.getNext();
            this.context.getAndCheckNext("\\[");
            while (!this.context.checkToken("\\]")) {
                this.context.getAndCheckNext("\"");
                node.comments.push(this.context.getNext());
                this.context.getAndCheckNext("\"");
                if (!this.context.checkToken(",")) {
                    break;
                }
                this.context.getAndCheckNext(",");
            }
            this.context.getNext();
        }
    }

    public visitConstructorDecl(node: ConstructorDecl): void {
        const indentLevel: number = this.context.getCurrentLineTabLevel();
        this.context.getAndCheckNext("constructor");
        node.modifier = this.context.getNext();

        if (this.context.getCurrentLineTabLevel() <= indentLevel) return;

        this.context.getAndCheckNext("params");
        node.params = new VarList();
        node.params.accept(this);
    }

    public visitDirDecl(node: DirDecl): void {
        node.tabLevel = this.context.getCurrentLineTabLevel();

        this.context.getAndCheckNext("dir");
        node.directoryName = this.context.getNext();

        this.parseDirContents(node);

        this.context.checkStartOfLine();
    }

    private parseDirContents(node: DirDecl): any {
        node.contents = [];

        while (this.context.getCurrentLineTabLevel() > node.tabLevel && !this.context.checkToken("NO_MORE_TOKENS")) {
            let contentDecl: Content;

            this.context.checkStartOfLine();

            if (this.context.checkToken("dir")) {
                contentDecl = new DirDecl(node.getAbsolutePath());
            } else if (this.context.checkToken("class") || this.context.checkToken("abstract")) {
                contentDecl = new ClassDecl(node.getAbsolutePath());
            } else if (this.context.checkToken("interface")) {
                contentDecl = new InterfaceDecl(node.getAbsolutePath());
            } else {
                throw new Error("Unexpected token in Dir declaration.");
            }

            contentDecl.accept(this);
            node.contents.push(contentDecl);

            this.context.checkStartOfLine();
        }
    }

    public visitExtendsDecl(node: ExtendsDecl): void {
        this.context.getAndCheckNext("extends");
        node.parentName = this.context.getNext();
    }

    public visitFieldDecl(node: FieldDecl): any {
        const indentLevel: number = this.context.getCurrentLineTabLevel();
        this.context.getAndCheckNext("fields");
        node.modifier = this.context.getNext();
        node.fields = new VarList();
        node.fields.accept(this);

        if (this.context.getCurrentLineTabLevel() <= indentLevel) {
            return;
        }

        this.context.getAndCheckNext("generate");
        this.parseGetterSetter(node);

        if (this.context.getCurrentLineTabLevel() <= indentLevel) {
            return;
        }

        this.context.getAndCheckNext("generate");
        this.parseGetterSetter(node);
    }

    private parseGetterSetter(node: FieldDecl) {
        const maybeGetterSetter = this.context.getNext();
        if (maybeGetterSetter === "getters") {
            node.generateGetter = true;
        } else if (maybeGetterSetter === "setters") {
            node.generateSetter = true;
        } else {
            throw new ParseError(`FieldDecl::failed to parse getter/setter`);
        }
    }

    // TODO: continue from FuncDecl.ts
}

