import "mocha";
import { expect } from "chai";

import { QuestionType, QuestionBinary } from '../src/question';
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
