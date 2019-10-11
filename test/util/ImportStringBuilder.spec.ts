import {expect} from "chai";
import {ClassDecl} from "../../src/ast/ClassDecl";
import {PathTable} from "../../src/util/PathTable";
import {ImportStringBuilder} from "../../src/util/ImportStringBuilder";
import {FieldDecl} from "../../src/ast/FieldDecl";
import {VarList} from "../../src/ast/VarList";
import FuncDecl from "../../src/ast/FuncDecl";
import {InterfaceDecl} from "../../src/ast/InterfaceDecl";
import ReturnDecl from "../../src/ast/ReturnDecl";

describe('ImportStringBuilder ClassDecl tests', function() {

    it('should build an import string body for a class that imports from the same directory', () => {
        let pathTable: PathTable = PathTable.getInstance();
        pathTable.addTypePath("Animal", "./src/animals/animal.ts")
        pathTable.addTypePath("Age", "./src/animals/age.ts");

        let animalClass = new ClassDecl("./src/animals");
        animalClass.className = "Animal";

        let animalFields = new FieldDecl();
        let animalFieldVarList = new VarList();
        animalFieldVarList.addPair("age", "Age");
        animalFields.fields = animalFieldVarList;

        animalClass.functions = [];
        animalClass.fields = [animalFields];

        expect(ImportStringBuilder.getImportsString(animalClass)).to.equal(
            "import {Age} from \"./age.ts\";\n");
    });

    it('should build an import string body for a class that imports from other sub-directory trees', () => {
        let pathTable: PathTable = PathTable.getInstance();
        pathTable.addTypePath("Animal", "./src/animals/animal.ts")
        pathTable.addTypePath("Age", "./src/animals/age.ts");
        pathTable.addTypePath("Diet", "./src/animals/diet.ts");
        pathTable.addTypePath("Blarg", "./test/util/blarg.ts");

        let animalClass = new ClassDecl("./src/animals");
        animalClass.className = "Animal";

        let animalFields = new FieldDecl();
        let animalFieldVarList = new VarList();
        animalFieldVarList.addPair("age", "Age");
        animalFieldVarList.addPair("diet", "Diet");
        animalFieldVarList.addPair("blarg", "Blarg");
        animalFields.fields = animalFieldVarList;

        animalClass.functions = [];
        animalClass.fields = [animalFields];

        expect(ImportStringBuilder.getImportsString(animalClass)).to.equal(
            "import {Age} from \"./age.ts\";\n" +
            "import {Diet} from \"./diet.ts\";\n" +
            "import {Blarg} from \"../../test/util/blarg.ts\";\n");
    });

    it('should build an import string body for a class that imports using fields, function params and function return', () => {
        let pathTable: PathTable = PathTable.getInstance();
        pathTable.addTypePath("Animal", "./src/animals/animal.ts")
        pathTable.addTypePath("Age", "./src/animals/age.ts");
        pathTable.addTypePath("Diet", "./src/animals/diet.ts");
        pathTable.addTypePath("Blarg", "./test/util/blarg.ts");
        pathTable.addTypePath("Owner", "./src/humans/owner.ts");
        pathTable.addTypePath("Firetruck", "./test/util/firetruck.ts");

        let animalClass = new ClassDecl("./src/animals");
        animalClass.className = "Animal";

        let animalFields = new FieldDecl();
        let animalFieldVarList = new VarList();
        animalFieldVarList.addPair("age", "Age");
        animalFieldVarList.addPair("diet", "Diet");
        animalFieldVarList.addPair("blarg", "Blarg");
        animalFields.fields = animalFieldVarList;

        let animalFunc = new FuncDecl();
        let animalParamVarList = new VarList();
        let animalFuncReturn = new ReturnDecl();
        animalFuncReturn.returnType = "Firetruck";
        animalParamVarList.addPair("owner", "Owner");
        animalFunc.params = animalParamVarList;
        animalFunc.returnDecl = animalFuncReturn;

        animalClass.functions = [animalFunc];
        animalClass.fields = [animalFields];

        expect(ImportStringBuilder.getImportsString(animalClass)).to.equal(
            "import {Age} from \"./age.ts\";\n" +
            "import {Diet} from \"./diet.ts\";\n" +
            "import {Blarg} from \"../../test/util/blarg.ts\";\n" +
            "import {Owner} from \"../humans/owner.ts\";\n" +
            "import {Firetruck} from \"../../test/util/firetruck.ts\";\n");
    });

    it('should build an import string body for a deeply nested class', () => {
        let pathTable: PathTable = PathTable.getInstance();
        pathTable.addTypePath("Animal", "./src/animals/onelevel/onemorelevel/animal.ts")
        pathTable.addTypePath("Age", "./src/animals/age.ts");
        pathTable.addTypePath("Diet", "./src/animals/diet.ts");
        pathTable.addTypePath("Blarg", "./test/util/blarg.ts");
        pathTable.addTypePath("Owner", "./src/humans/owner.ts");
        pathTable.addTypePath("Firetruck", "./test/util/firetruck.ts");

        let animalClass = new ClassDecl("./src/animals/onelevel/onemorelevel");
        animalClass.className = "Animal";

        let animalFields = new FieldDecl();
        let animalFieldVarList = new VarList();
        animalFieldVarList.addPair("age", "Age");
        animalFieldVarList.addPair("diet", "Diet");
        animalFieldVarList.addPair("blarg", "Blarg");
        animalFields.fields = animalFieldVarList;

        let animalFunc = new FuncDecl();
        let animalParamVarList = new VarList();
        let animalFuncReturn = new ReturnDecl();
        animalFuncReturn.returnType = "Firetruck";
        animalParamVarList.addPair("owner", "Owner");
        animalFunc.params = animalParamVarList;
        animalFunc.returnDecl = animalFuncReturn;

        animalClass.functions = [animalFunc];
        animalClass.fields = [animalFields];

        expect(ImportStringBuilder.getImportsString(animalClass)).to.equal(
            "import {Age} from \"../../age.ts\";\n" +
            "import {Diet} from \"../../diet.ts\";\n" +
            "import {Blarg} from \"../../../../test/util/blarg.ts\";\n" +
            "import {Owner} from \"../../../humans/owner.ts\";\n" +
            "import {Firetruck} from \"../../../../test/util/firetruck.ts\";\n");
    });
});

describe('ImportStringBuilder InterfaceDecl tests', function() {

    it('should build an import string body for a interface that imports from the same directory', () => {
        let pathTable: PathTable = PathTable.getInstance();
        pathTable.addTypePath("Animal", "./src/animals/animal.ts")
        pathTable.addTypePath("Age", "./src/animals/age.ts");

        let animalInterface = new InterfaceDecl("./src/animals");
        animalInterface.interfaceName = "Animal";

        let animalFields = new FieldDecl();
        let animalFieldVarList = new VarList();
        animalFieldVarList.addPair("age", "Age");
        animalFields.fields = animalFieldVarList;

        animalInterface.functions = [];
        animalInterface.fieldDecl = animalFields;

        expect(ImportStringBuilder.getImportsString(animalInterface)).to.equal(
            "import {Age} from \"./age.ts\";\n");
    });

    it('should build an import string body for a interface that imports from other sub-directory trees', () => {
        let pathTable: PathTable = PathTable.getInstance();
        pathTable.addTypePath("Animal", "./src/animals/animal.ts")
        pathTable.addTypePath("Age", "./src/animals/age.ts");
        pathTable.addTypePath("Diet", "./src/animals/diet.ts");
        pathTable.addTypePath("Blarg", "./test/util/blarg.ts");

        let animalInterface = new InterfaceDecl("./src/animals");
        animalInterface.interfaceName = "Animal";

        let animalFields = new FieldDecl();
        let animalFieldVarList = new VarList();
        animalFieldVarList.addPair("age", "Age");
        animalFieldVarList.addPair("diet", "Diet");
        animalFieldVarList.addPair("blarg", "Blarg");
        animalFields.fields = animalFieldVarList;

        animalInterface.functions = [];
        animalInterface.fieldDecl = animalFields;

        expect(ImportStringBuilder.getImportsString(animalInterface)).to.equal(
            "import {Age} from \"./age.ts\";\n" +
            "import {Diet} from \"./diet.ts\";\n" +
            "import {Blarg} from \"../../test/util/blarg.ts\";\n");
    });

    it('should build an import string body for a interface that imports using fields, function params and function return', () => {
        let pathTable: PathTable = PathTable.getInstance();
        pathTable.addTypePath("Animal", "./src/animals/animal.ts")
        pathTable.addTypePath("Age", "./src/animals/age.ts");
        pathTable.addTypePath("Diet", "./src/animals/diet.ts");
        pathTable.addTypePath("Blarg", "./test/util/blarg.ts");
        pathTable.addTypePath("Owner", "./src/humans/owner.ts");
        pathTable.addTypePath("Firetruck", "./test/util/firetruck.ts");

        let animalInterface = new InterfaceDecl("./src/animals");
        animalInterface.interfaceName = "Animal";

        let animalFields = new FieldDecl();
        let animalFieldVarList = new VarList();
        animalFieldVarList.addPair("age", "Age");
        animalFieldVarList.addPair("diet", "Diet");
        animalFieldVarList.addPair("blarg", "Blarg");
        animalFields.fields = animalFieldVarList;

        let animalFunc = new FuncDecl();
        let animalParamVarList = new VarList();
        let animalFuncReturn = new ReturnDecl();
        animalFuncReturn.returnType = "Firetruck";
        animalParamVarList.addPair("owner", "Owner");
        animalFunc.params = animalParamVarList;
        animalFunc.returnDecl = animalFuncReturn;

        animalInterface.functions = [animalFunc];
        animalInterface.fieldDecl = animalFields;

        expect(ImportStringBuilder.getImportsString(animalInterface)).to.equal(
            "import {Age} from \"./age.ts\";\n" +
            "import {Diet} from \"./diet.ts\";\n" +
            "import {Blarg} from \"../../test/util/blarg.ts\";\n" +
            "import {Owner} from \"../humans/owner.ts\";\n" +
            "import {Firetruck} from \"../../test/util/firetruck.ts\";\n");
    });
});
