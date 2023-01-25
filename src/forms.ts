import {Question, QuestionBinary, QuestionRating, QuestionJSON} from './question';
import {ValidationSuccess, ValidationError, ValidationResult, VErrorReason} from './validation';

export type FormSummary = {
    formId: string,
    internalName: string,
    formText: string,
}

export type FormJSON = {
    formId: string,
    internalName: string,
    formText: string,
    questions: QuestionJSON[],
}

export class Form  {
    formId: string;
    formText: string;
    internalName: string;
    questions: Question[];

    constructor(formId: string, internalName: string, text: string) {
        this.formId = formId;
        this.formText = text;
        this.internalName = internalName;
        this.questions = [];
    }

    setText(formText: string) : void {
        this.formText = formText;
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

    validateResponseN(r: Map<number, any>) : ValidationResult {
        // FIXME: later issues with matrix response keys
        const r2 = new Map<string, any>();
        r.forEach((v:any,k:number) => { r2.set(k.toString(),v) });
        return this.validateResponse(r2);
    }

    toSummary() : FormSummary {
        return {
            formId: this.formId,
            formText: this.formText,
            internalName: this.internalName,
        }
    }

    toObject() : FormJSON {
        const qs: QuestionJSON[] = [];
        this.questions.forEach((q,i) => {qs.push(q.toObject())});
        return ({
            formId: this.formId,
            formText: this.formText,
            internalName: this.internalName,
            questions: qs,
        });
    }

    static fromObject(json: FormJSON) : Form {
        const f = new Form(json.formId, json.internalName, json.formText);
        json.questions.forEach((q,i) => {f.questions.push(Question.fromObject(q))});
        return f;
    }

    validateResponse(r: Map<string, any>) : ValidationResult {
        const success: ValidationSuccess = {};
        let validationResult: ValidationResult = success;

        this.questions.forEach((q,i) => {
            const value = r.get(q.index.toString());
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
