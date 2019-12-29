import {Tokenizer} from "../src/util/Tokenizer";
import {ProgramDecl} from "../src/ast/ProgramDecl";
import {AstNode} from "../src/ast/AstNode";
import InheritanceVisitor from "../src/codegen/InheritanceVisitor";

const args: string[] = process.argv.slice(2);
const fileToParse: string = args[0];

let tokenizer: Tokenizer = new Tokenizer(fileToParse, "../ui");
let program: AstNode = new ProgramDecl(".");
let inheritanceVisitor: InheritanceVisitor = new InheritanceVisitor();
console.log("Parsing your program...");
program.parse(tokenizer);
console.log("Typechecking your program...");
program.typeCheck();
console.log("Generating your program...");
program.accept(inheritanceVisitor);
program.evaluate();
