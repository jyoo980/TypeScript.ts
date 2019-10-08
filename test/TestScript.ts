import ts = require("typescript");

// SOURCE: https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API

function makeFactorialFunction() {
  const functionName = ts.createIdentifier("factorial");
  const paramName = ts.createIdentifier("n");
  const keywordType = ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
  const parameter = ts.createParameter(
      /* decorators */ undefined,
      /* modifiers */ undefined,
      /* dotdotToken */ undefined,
      paramName,
      /* questionToken */ undefined,
      ts.createTypeReferenceNode("IInsightFacade", undefined)
  );

  const condition = ts.createBinary(
    paramName,
    ts.SyntaxKind.LessThanEqualsToken,
    ts.createLiteral(1)
  );

  const ifBody = ts.createBlock(
    [ts.createReturn(ts.createLiteral(1))],
    /*multiline*/ true
  );
  const decrementedArg = ts.createBinary(
    paramName,
    ts.SyntaxKind.MinusToken,
    ts.createLiteral(1)
  );
  const recurse = ts.createBinary(
    paramName,
    ts.SyntaxKind.AsteriskToken,
    ts.createCall(functionName, /*typeArgs*/ undefined, [decrementedArg])
  );
  const statements = [ts.createIf(condition, ifBody), ts.createReturn(recurse)];

  return ts.createFunctionDeclaration(
      /* decorators */ undefined,
      /* modifiers */ [ts.createModifier(ts.SyntaxKind.PublicKeyword)],
      /* asteriskToken */ undefined,
      "makeParamDecl",
      /* typeParameters */ undefined,
      [
        ts.createParameter(
            /* decorators */ undefined,
            /* modifiers */ undefined,
            /* dotDotToken */ undefined,
            "name",
            /* questionToken */ undefined,
            ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)),
        ts.createParameter(
            /* decorators */ undefined,
            /* modifiers */ undefined,
            /* dotDotToken */ undefined,
            "type",
            /* questionToken */ undefined,
            ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        )],
      ts.createTypeReferenceNode("ParameterDecl", undefined),
      undefined
  );
}

const resultFile = ts.createSourceFile(
  "someFileName.ts",
  "",
  ts.ScriptTarget.Latest,
  /*setParentNodes*/ false,
  ts.ScriptKind.TS
);
const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed
});
const result = printer.printNode(
  ts.EmitHint.Unspecified,
   // replace this line with our call to createFun, or the result of it from the tests
   makeFactorialFunction(),
  resultFile
);

console.log(result);
