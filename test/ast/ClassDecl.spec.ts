import { expect } from "chai";
import {ClassDecl} from "../../src/ast/ClassDecl";
import {ParseError, Tokenizer, TokenizerError} from "../../src/util/Tokenizer";
import {TypeCheckError, TypeTable} from "../../src/ast/symbols/TypeTable";
import * as nodeFs from "fs-extra";
import TypeCheckVisitor from "../../src/codegen/TypeCheckVisitor";

describe("ClassDecl parse test", () => {

    const DUMMY_ROOT_DIR: string = ".";

    it("parses complex class definition", () => {
        let tokenizer : Tokenizer = new Tokenizer("classDeclComplex.txt", "./test/testFiles");
        let classDec : ClassDecl = new ClassDecl(DUMMY_ROOT_DIR);
        classDec = classDec.parse(tokenizer);
        expect(classDec.isAbstract).to.be.false;
        expect(classDec.className).to.equal("Time");

        expect(classDec.implementsNodes.parentNames.length).to.equal(2);
        expect(classDec.implementsNodes.parentNames[0]).to.equal("ITime");
        expect(classDec.implementsNodes.parentNames[1]).to.equal("DateTime");

        expect(classDec.extendsNodes.parentName).to.equal("TimeClass");

        expect(classDec.comments.comments.length).to.equal(1);
        expect(classDec.comments.comments[0]).to.equal("This is the time class");

        expect(classDec.fields.length).to.equal(2);
        //fields private [number dayOfWeek, number hour, number minute]
        expect(classDec.fields[0].modifier).to.equal("private");
        expect(classDec.fields[0].fields.nameTypeMap.size).to.equal(3);
        expect(classDec.fields[0].generateGetter).to.equal(true);
        expect(classDec.fields[0].generateSetter).to.equal(true);

        expect(classDec.fields[1].modifier).to.equal("public");
        expect(classDec.fields[1].fields.nameTypeMap.size).to.equal(1);
        expect(classDec.fields[1].generateGetter).to.equal(true);
        expect(classDec.fields[1].generateSetter).to.equal(false);

        expect(classDec.functions.length).to.equal(8);
        // function public getDate
        // params [string id, string content, InsightDatasetKind kind]
        // comments ["creates a new Time object from given date",
        //     "{param} date - date object to parse time object from"]
        // returns Date
        expect(classDec.functions[7].modifier).to.equal("public");
        expect(classDec.functions[7].maybeStatic.isStatic).to.be.false;
        expect(classDec.functions[7].maybeAsync.isAsync).to.be.false;
        expect(classDec.functions[7].params.nameTypeMap.size).to.equal(3);
        expect(classDec.functions[7].comments.comments.length).to.equal(2);
        expect(classDec.functions[7].returnDecl.returnType).to.equal("string");

        // getter for dayOfWeek
        expect(classDec.functions[0].modifier).to.equal("public");
        expect(classDec.functions[0].maybeStatic.isStatic).to.be.false;
        expect(classDec.functions[0].maybeAsync.isAsync).to.be.false;
        expect(classDec.functions[0].params.nameTypeMap.size).to.equal(0);
        expect(classDec.functions[0].comments.comments.length).to.equal(0);
        expect(classDec.functions[0].returnDecl.returnType).to.equal("number");

        // setter for dayOfWeek
        expect(classDec.functions[3].modifier).to.equal("public");
        expect(classDec.functions[3].maybeStatic.isStatic).to.be.false;
        expect(classDec.functions[3].maybeAsync.isAsync).to.be.false;
        expect(classDec.functions[3].params.nameTypeMap.size).to.equal(1);
        expect(classDec.functions[3].comments.comments.length).to.equal(0);
        expect(classDec.functions[3].returnDecl.returnType).to.equal("void");

    });

    it("throws a parse error when class definition includes extends after implements", () => {
        let tokenizer : Tokenizer = new Tokenizer("classDeclInvalidFirstLine.txt", "./test/testFiles");
        let classDec : ClassDecl = new ClassDecl(DUMMY_ROOT_DIR);
        expect(() => {classDec.parse(tokenizer)}).to.throw(TokenizerError);
    });

    it("throws a parse error when class definition field decl with missing new line", () => {
        let tokenizer : Tokenizer = new Tokenizer("classDeclInvalidMergedLines.txt", "./test/testFiles");
        let classDec : ClassDecl = new ClassDecl(DUMMY_ROOT_DIR);
        expect(() => {classDec.parse(tokenizer)}).to.throw(TokenizerError);
    });

    it("throws a parse error when there is an invalid value inside the class", () => {
        let tokenizer : Tokenizer = new Tokenizer("classDeclInvalidInputs.txt", "./test/testFiles");
        let classDec : ClassDecl = new ClassDecl(DUMMY_ROOT_DIR);
        expect(() => {classDec.parse(tokenizer)}).to.throw(ParseError);
    });
});

describe("ClassDecl type check test", () => {
    const DUMMY_ROOT_DIR: string = ".";
    const typeChecker = new TypeCheckVisitor();

    it("should throw a TypeCheckError when it attempts to extend a undeclared class", () => {
        let tokenizer : Tokenizer = new Tokenizer("classDeclSimple.txt", "./test/testFiles");
        let classDec : ClassDecl = new ClassDecl(DUMMY_ROOT_DIR);
        classDec.parse(tokenizer);
        expect(() => {
            return classDec.accept(typeChecker);
        }).to.throw(TypeCheckError);
    });

    it("should NOT throw a TypeCheckError when it attempts to extend a class which has been defined", () => {
        let tokenizer : Tokenizer = new Tokenizer("classDeclSimple.txt", "./test/testFiles");
        let classDec : ClassDecl = new ClassDecl(DUMMY_ROOT_DIR);
        classDec.parse(tokenizer);
        TypeTable.getInstance().addClass("TimeClass");
        classDec.accept(typeChecker);
    });

});

describe ("ClassDecl evaluate test", () => {

    const OUTPUT_DIR: string = "./codegen/test";
    const createdFiles: string[] = [];

    after(async () => {
        try {
            const deleteOps: Array<Promise<void>> = createdFiles.map((toDelete: string) => nodeFs.unlink(toDelete));
            await Promise.all(deleteOps);
        } catch (err) {
            console.warn(`FileSystemSpec::cleanup failed with error: ${err}`);
        }
    });

    it("writes simple class definition to disk", () => {
        let tokenizer : Tokenizer = new Tokenizer("classDeclSimple.txt", "./test/testFiles");
        let classDec : ClassDecl = new ClassDecl(OUTPUT_DIR);
        classDec.parse(tokenizer);
        classDec.evaluate();
        createdFiles.push(OUTPUT_DIR  + "/Time.ts");
    });

    it("writes complex class definition to disk", () => {
        let tokenizer : Tokenizer = new Tokenizer("classDeclComplex.txt", "./test/testFiles");
        let classDec : ClassDecl = new ClassDecl(OUTPUT_DIR);
        classDec.parse(tokenizer);
        classDec.evaluate();
        createdFiles.push(OUTPUT_DIR  + "/Time.ts");
    });

    it("writes an abstract class to disk", () => {
        let tokenizer : Tokenizer = new Tokenizer("classDeclAbstract.txt", "./test/testFiles");
        let classDec : ClassDecl = new ClassDecl(OUTPUT_DIR);
        classDec.parse(tokenizer);
        classDec.evaluate();
        // createdFiles.push(OUTPUT_DIR  + "/Time.ts");
    })

});
