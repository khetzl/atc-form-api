import { Question } from './question';
import { ValidationResult } from './validation';
export declare class Form {
    campaignId: number;
    campaignText: string;
    formId: number;
    questions: Question[];
    constructor(campaignId: number, formId: number, campaignText: string);
    setText(campaignText: string): void;
    addBinary(text: string): void;
    addBinaryCustom(text: string, choiceA: string, choiceB: string): void;
    addRating(text: string): void;
    validateResponseN(r: Map<number, any>): ValidationResult;
    validateResponse(r: Map<string, any>): ValidationResult;
}
