/**
 * Represents the project
 *
 * e.g. project (str | StrList) nl MODULE nl CONTENT*
 */
import {AstNode} from "./AstNode";
import {ModuleDecl} from "./ModuleDecl";
import {Content} from "./Content";

export class Project extends AstNode {

    projects: string[];
    modules: ModuleDecl;
    content: Content[];
    // TODO: add members for the nested directory or class or interface

    public parse(): any {
        // TODO: implement this.
        this.projects = [];
        // parse project name(s)
        // parse Module
        this.modules = new ModuleDecl();
        // parse Content
        // (maybe content parse should figure out which kind of content it is?)
    }

    public evaluate(): any {
        // TODO: implement this.
        // TODO: should this evaluate for each project name?
        // evaluate modules
        // evaluate content
    }
}