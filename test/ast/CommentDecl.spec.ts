import { expect } from "chai";
import CommentDecl from "../../src/ast/CommentDecl";
import {Tokenizer} from "../../src/util/Tokenizer";

describe("CommentDecl parse test", () => {

    let commentDecl: CommentDecl;

    beforeEach(() => {
        commentDecl = new CommentDecl();
    });

    it ("should parse a single-line comment", () => {
        const tokenizer: Tokenizer = new Tokenizer("singleLineComment.txt", "./test/testFiles");
        commentDecl.parse(tokenizer);
        expect(commentDecl.comments).to.deep.equal(["this is a single line comment"]);
    });

    it ("should parse a multi-line comment (even no.)", () => {
        const tokenizer: Tokenizer = new Tokenizer("multiLineCommentEven.txt", "./test/testFiles");
        commentDecl.parse(tokenizer);
        expect(commentDecl.comments).to.deep.equal(["this is a", "multiline comment"]);
    });

    it ("should parse a multi-line comment (odd no.)", () => {
        const tokenizer: Tokenizer = new Tokenizer("multiLineCommentOdd.txt", "./test/testFiles");
        commentDecl.parse(tokenizer);
        expect(commentDecl.comments).to.deep.equal(["this is a", "odd", "multiline"]);
    });
});
