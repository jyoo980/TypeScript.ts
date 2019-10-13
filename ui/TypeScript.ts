import {Tokenizer} from "../src/util/Tokenizer";
import {ProgramDecl} from "../src/ast/ProgramDecl";

const args: string[] = process.argv.slice(2);
const fileToParse: string = args[0];

let tokenizer: Tokenizer = new Tokenizer(fileToParse, "../ui");
let program: ProgramDecl = new ProgramDecl(".");
console.log("Parsing your program...");
program.parse(tokenizer);
console.log("Typechecking your program...");
program.typeCheck();
console.log("Generating your program...");
program.fulfillContract();
program.evaluate();
