import {Tokenizer} from "../src/util/Tokenizer";
import {ProgramDecl} from "../src/ast/ProgramDecl";
import {AstNode} from "../src/ast/AstNode";
import InheritanceVisitor from "../src/codegen/InheritanceVisitor";
import TypeCheckVisitor from "../src/codegen/TypeCheckVisitor";
import EvalVisitor from "../src/codegen/EvalVisitor";

const args: string[] = process.argv.slice(2);
const fileToParse: string = args[0];

let tokenizer: Tokenizer = new Tokenizer(fileToParse, "../ui");
let program: AstNode = new ProgramDecl(".");
const inheritanceVisitor: InheritanceVisitor = new InheritanceVisitor();
const typeChecker: TypeCheckVisitor = new TypeCheckVisitor();
const evalVisitor: EvalVisitor = new EvalVisitor();
console.log("Parsing your program...");
program.parse(tokenizer);
console.log("Typechecking your program...");
program.accept(typeChecker);
console.log("Generating your program...");
program.accept(inheritanceVisitor);
program.accept(evalVisitor);
