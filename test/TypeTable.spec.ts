import { expect } from "chai";
import {TypeTable} from "../src/ast/symbols/TypeTable";

describe("TypeTable tests", () => {

    let table: TypeTable;

    before(() => {
        table = new TypeTable();
    });

    it("should contain TypeScript's primitive types", () => {
        expect(table.isValidType("number")).to.equal(true);
        expect(table.isValidType("boolean")).to.equal(true);
        expect(table.isValidType("string")).to.equal(true);
    });


    it("should be able to add interfaces", () => {
        const insightFacadeInterface: string = "IInsightFacade";
        table.addInterface(insightFacadeInterface);
        expect(table.isValidType(insightFacadeInterface));
    });
});
