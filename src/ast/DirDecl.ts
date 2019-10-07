/**
 * Represents the directories a TypeScript project may have.
 *
 * e.g. dir str (DIR | CLASS| INTERFACE)+
 */
import {Content} from "./Content";
import {Tokenizer} from "../util/Tokenizer";

export class DirDecl extends Content {

    directory: string;

    // The contents of this directory
    contents: Content[];

    public parse(context: Tokenizer): any {
        // TODO: implement this.
    }

    public evaluate(): any {
        // TODO: implement this.
    }
}
