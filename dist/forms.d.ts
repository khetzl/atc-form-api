import { Question, QuestionJSON } from './question';
import { ValidationResult } from './validation';
export type FormSummary = {
    formId?: string;
    internalName: string;
    formText: string;
};
type FormJSON = {
    formId: string;
    formText: string;
    campaignId?: string;
    questions: QuestionJSON[];
};
export declare class Form {
    formId: string;
    formText: string;
    campaignId?: string;
    questions: Question[];
    constructor(formId: string, text: string);
    setText(campaignText: string): void;
    addBinary(text: string): void;
    addBinaryCustom(text: string, choiceA: string, choiceB: string): void;
    addRating(text: string): void;
    validateResponseN(r: Map<number, any>): ValidationResult;
    toSummary(): FormSummary;
    toObject(): FormJSON;
    static fromObject(json: FormJSON): Form;
    validateResponse(r: Map<string, any>): ValidationResult;
}
export {};
