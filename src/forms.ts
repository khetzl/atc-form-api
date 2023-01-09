import {Question, QuestionBinary, QuestionRating} from './question';
import {ValidationSuccess, ValidationError, ValidationResult, VErrorReason} from './validation';

export class Form  {
    campaignId: number;
    campaignText: string;
    formId: number;
    questions: Question[];
    
    constructor(campaignId: number, formId: number, campaignText: string) {
        this.campaignId = campaignId;
        this.campaignText = campaignText;
        this.formId = formId;
        this.questions = [];
    }   

    setText(campaignText: string) : void {
        this.campaignText = campaignText;
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
            try
                {
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
