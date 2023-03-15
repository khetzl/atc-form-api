import 'reflect-metadata';
import { Question, QuestionJSON } from './questions';
import { ValidationResult } from './validation';
export type FormJSON = {
    formId: string;
    questions: QuestionJSON[];
};
export declare class Form {
    formId: string;
    questions: Question[];
    constructor(formId: string);
    addBinary(text: string): void;
    addBinaryCustom(text: string, choiceA: string, choiceB: string): void;
    addRating(text: string): void;
    addText(text: string): void;
    toObject(): FormJSON;
    isChanged(f: Form): boolean;
    static fromObject(json: FormJSON): Form;
    validateResponse(r: Map<number, any>): ValidationResult;
}
