import "mocha";
import { expect } from "chai";

import { Form } from '../src/forms';
import { QuestionType, QuestionBinary } from '../src/question';
import {isSuccess, ValidationError} from '../src/validation';

describe("Create Form", () => {
    it("New should be empty, and have basics set up", () =>
        {
            const f = new Form(1,1, "test");
            expect(f.campaignId).to.eq(1);
            expect(f.formId).to.eq(1);
            expect(f.campaignText).to.eq("test");
            expect(f.questions).to.eql([]);
        });
    it("Adding questions", () =>
        {
            const f = new Form(1,1, "test");
            expect(f.questions).to.eql([]);

            f.addBinary("binary1");
            expect(f.questions.length).to.eql(1);
            
            const l = [new QuestionBinary(0, "binary1")];
            expect(f.questions).to.deep.eq(l);
        });
});

describe("Validate Form Response", () => {
    it("Empty", () => {
        const f = new Form(1,1,"test");
        const r0 = new Map<string,any>([]);
        expect(isSuccess(f.validateResponse(r0))).to.be.true;
    });    
    it("Single validation - binary", () => {
        const f = new Form(1,1,"test");
        f.addBinary("b");

        const r0 = new Map<string,any>([['0', 0]]);
        expect(isSuccess(f.validateResponse(r0))).to.be.true;
        const r1 = new Map<string,any>([['0', 1]]);
        expect(isSuccess(f.validateResponse(r1))).to.be.true;

        const rOutOfBounds0 = new Map<string,any>([['0', 2]]);
        const vr0 = f.validateResponse(rOutOfBounds0);
        expect(isSuccess(vr0)).to.be.false;
        expect((vr0 as ValidationError).reason).to.equal('out of bounds');
        
        const rOutOfBounds1 = new Map<string,any>([['0', -1]]);
        const vr1 = f.validateResponse(rOutOfBounds1);
        expect(isSuccess(vr1)).to.be.false;
        expect((vr1 as ValidationError).reason).to.equal('out of bounds');
        
        const rNonMatchingIndex = new Map<string,any>([['123', 0]]);
        const vrNM = f.validateResponse(rNonMatchingIndex);
        expect(isSuccess(vrNM)).to.be.false;
        expect((vrNM as ValidationError).reason).to.equal('value undefined for key');

        const rType = new Map<string,any>([['0', "stringtype"]]);
        const vrT = f.validateResponse(rType);
        expect(isSuccess(vrT)).to.be.false;
        expect((vrT as ValidationError).reason).to.equal('unexpected type');
    });
});
