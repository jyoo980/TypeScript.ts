/**
 * Represents the directories a TypeScript project may have.
 *
 * e.g. dir str (DIR | CLASS| INTERFACE)+
 */
import {Content} from "./Content";
import {Tokenizer} from "../util/Tokenizer";
import {ClassDecl} from "./ClassDecl";
import {InterfaceDecl} from "./InterfaceDecl";
import {AstNode} from "./AstNode";

export class DirDecl extends Content {

    directoryName: string;

    // The contents of this directory
    contents: Content[];

    tabLevel: number;

    public parse(context: Tokenizer): any {
        this.tabLevel = context.getCurrentLineTabLevel();

        context.getAndCheckNext("dir");
        this.directoryName = context.getNext();

        this.parseContents(context);
    }

    protected parseContents(context: Tokenizer): any {
        this.contents = [];

        while (context.getCurrentLineTabLevel() > this.tabLevel && !context.checkToken("NO_MORE_TOKENS")) {
            let contentDecl: Content;

            if (context.checkToken("dir")) {
                contentDecl = new DirDecl();
            } else if (context.checkToken("class")) {
                contentDecl = new ClassDecl();
            } else if (context.checkToken("interface")) {
                contentDecl = new InterfaceDecl();
            } else {
                throw new Error("Unexpected token in Dir declaration.");
            }

            contentDecl.parse(context);
            this.contents.push(contentDecl);
        }
    }

    public evaluate(): any {
        // TODO: implement this.
    }

    public typeCheck(): void {
        this.contents.forEach((content: AstNode) => content.typeCheck());
    }
}
