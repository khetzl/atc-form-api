import { Question, QuestionJSON } from './question';
import { ValidationResult } from './validation';
export type FormSummary = {
    formId: string;
    internalName: string;
    formText: string;
};
export type FormJSON = {
    formId: string;
    internalName: string;
    formText: string;
    questions: QuestionJSON[];
};
export declare class Form {
    formId: string;
    formText: string;
    internalName: string;
    questions: Question[];
    constructor(formId: string, internalName: string, text: string);
    setText(formText: string): void;
    addBinary(text: string): void;
    addBinaryCustom(text: string, choiceA: string, choiceB: string): void;
    addRating(text: string): void;
    validateResponseN(r: Map<number, any>): ValidationResult;
    toSummary(): FormSummary;
    toObject(): FormJSON;
    static fromObject(json: FormJSON): Form;
    validateResponse(r: Map<string, any>): ValidationResult;
}
