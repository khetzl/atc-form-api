import "mocha";
import { expect } from "chai";

import { Question, QuestionType, QuestionBinary, QuestionText } from '../src/questions';
import { VErrorReason } from '../src/validation';

describe("Validation - Binary", () => {
    let q: QuestionBinary;
    beforeEach(() => {
        q = new QuestionBinary(1, "question");
    });
    
    it("Accepted values", () => {
        q.isValidResponse(0);
        q.isValidResponse(1);
    });

    it("Unaccepted numbers", () => {
        expect(() => q.isValidResponse(-1)).to.throw(VErrorReason.OutOfBounds);
        expect(() => q.isValidResponse(2)).to.throw(VErrorReason.OutOfBounds);
        expect(() => q.isValidResponse(0.5)).to.throw(VErrorReason.OutOfBounds);
    });
    it("Unaccepted types", () => {
        expect(() => q.isValidResponse("string")).to.throw(VErrorReason.UnexpectedType);
    });
});

describe("Conversion", () => {    
    it("Can convert Text type question from and to JSON", () => {
        const json = {questionType: 3, questionText: 'asd', index: 0};
        const q = new QuestionText(0, 'asd');
        expect(Question.fromObject(json)).to.deep.equal(q);
        expect(q.toObject()).to.deep.equal(json);
        // back and forth
        expect((Question.fromObject(json)).toObject()).to.deep.equal(json);
    });
});
