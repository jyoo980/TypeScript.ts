import Visitor from "./Visitor";
import TypeScriptEngine from "./TypeScriptEngine";
import {ClassDecl} from "../ast/ClassDecl";
import {ImportStringBuilder} from "../util/ImportStringBuilder";
import PrintUtil from "../util/PrintUtil";
import ts = require("typescript");
import FileSystem from "../util/FileSystem";
import {DirDecl} from "../ast/DirDecl";
import {Content} from "../ast/Content";
import {InterfaceDecl} from "../ast/InterfaceDecl";
import {ModuleDecl} from "../ast/ModuleDecl";
import PackageJson from "../util/PackageJson";
import {ProgramDecl} from "../ast/ProgramDecl";

export default class EvalVisitor extends Visitor {

    private readonly printer: PrintUtil =
        new PrintUtil(ts.createPrinter({newLine: ts.NewLineKind.LineFeed}));
    private readonly compiler: TypeScriptEngine = new TypeScriptEngine();
    private readonly fileSystem: FileSystem = new FileSystem();

    public visitClassDecl(node: ClassDecl): void {
        const importStr: string = ImportStringBuilder.getImportsString(node);
        const tsNodeStr: string = this.printer.tsNodeToString(this.compiler.createClass(node));
        const tsFileStr: string = importStr === "" ? `${tsNodeStr}` : `${importStr}\n${tsNodeStr}`;
        this.fileSystem.generateFile(node.className, node.parentPath, tsFileStr);
    }

    public visitDirDecl(node: DirDecl): void {
        const dirPath: string = node.getAbsolutePath();
        this.fileSystem.writeDirectory(dirPath);
        node.contents.forEach((content: Content) => content.accept(this));
    }

    public visitInterfaceDecl(node: InterfaceDecl): void {
        const tsNode = this.compiler.createInterface(node);
        const importStr: string = ImportStringBuilder.getImportsString(node);
        const tsNodeAsString: string = this.printer.tsNodeToString(tsNode);
        const tsFileStr: string = importStr === "" ? `${tsNodeAsString}` : `${importStr}\n${tsNodeAsString}`;
        this.fileSystem.generateFile(node.interfaceName, node.parentPath, tsFileStr);
    }

    public visitModuleDecl(node: ModuleDecl): void {
        const packageJson: PackageJson = new PackageJson(node.path, node.projectName);
        packageJson.addModules(node.modules);
    }

    public visitProgramDecl(node: ProgramDecl): void {
        node.directoryName = node.projectName;
        node.modules.setPath(node.getAbsolutePath());
        node.modules.setProjectName(node.projectName);
        this.fileSystem.writeDirectory(node.getAbsolutePath());
        node.modules.accept(this);
    }


}
