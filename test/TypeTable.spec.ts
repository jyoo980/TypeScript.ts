import { expect } from "chai";
import {TypeTable} from "../src/ast/symbols/TypeTable";

describe("TypeTable tests", () => {

    let table: TypeTable;

    before(() => {
        table = TypeTable.getInstance();
    });

    it("should contain TypeScript's primitive types", () => {
        expect(table.isValidType("number")).to.equal(true);
        expect(table.isValidType("boolean")).to.equal(true);
        expect(table.isValidType("string")).to.equal(true);
        expect(table.isValidType("void")).to.equal(true);
    });


    it("should be able to add interfaces", () => {
        const insightFacadeInterface: string = "IInsightFacade";
        table.addInterface(insightFacadeInterface);
        expect(table.isValidType(insightFacadeInterface));
    });

    it("should return false when given an invalid type for isValidType", () => {
        expect(table.isValidType("not valid type")).to.equal(false);
    });

    it("should return true if every given type is valid", () => {
        expect(table.areValidTypes(["number", "boolean"])).to.equal(true);
    });

    it("should return false is at least one given type is invalid", () => {
        expect(table.areValidTypes(["number", "not a valid type", "string"])).to.equal(false);
    });
});
