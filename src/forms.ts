import 'reflect-metadata';
import { Type } from 'class-transformer';

import {Question, QuestionBinary, QuestionRating, QuestionText, QuestionJSON} from './questions';
import {ValidationSuccess, ValidationError, ValidationResult, VErrorReason} from './validation';

export type FormJSON = {
    formId: string,
    questions: QuestionJSON[],
}

export class Form  {
    formId: string;
    @Type(type => Question)
    questions: Question[];

    constructor(formId: string) {
        this.formId = formId;
        this.questions = [];
    }

    addBinary(text: string) : void {
        const q: Question = new QuestionBinary(this.questions.length, text);
        this.questions.push(q);
    }

    addBinaryCustom(text: string, choiceA: string, choiceB: string) : void {
        const q = new QuestionBinary(this.questions.length, text);
        q.setCustomChoices(choiceA,choiceB);
        this.questions.push(q);
    }

    addRating(text: string) : void {
        const q = new QuestionRating(this.questions.length, text);
        this.questions.push(q);
    }

    addText(text: string) : void {
        const q = new QuestionText(this.questions.length, text);
        this.questions.push(q);
    }

    toObject() : FormJSON {
        const qs: QuestionJSON[] = [];
        this.questions.forEach((q,i) => {qs.push(q.toObject())});
        return ({
            formId: this.formId,
            questions: qs,
        });
    }

    isChanged(f: Form) : boolean {
        return this.formId !== f.formId ||
            this.questions.some((q: Question, i: number) => {
                if (f.questions.length > i) {
                    return q.isChanged(f.questions[i]);
                } else {
                    return true;
                }
            });
    }

    static fromObject(json: FormJSON) : Form {
        const f = new Form(json.formId);
        json.questions.forEach((q,i) => {f.questions.push(Question.fromObject(q))});
        return f;
    }

    validateResponse(r: Map<number, any>) : ValidationResult {
        const success: ValidationSuccess = {};
        let validationResult: ValidationResult = success;

        this.questions.forEach((q,i) => {
            const value = r.get(q.index);
            if (typeof value === "undefined") {
                const validationError : ValidationError =
                    {reason: VErrorReason.Missing, qIndex: q.index, value};
                validationResult = validationError;
            }else{
                try{
                    q.isValidResponse(value);
                } catch (e) {
                    let message = 'Unknown Error';
                    if (e instanceof Error) message = e.message;
                    const validationError : ValidationError =
                        {reason: message, qIndex: q.index, value: value};
                    validationResult = validationError;
                }
            }
        });
        return validationResult;
    }


};
