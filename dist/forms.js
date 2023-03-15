"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Form = void 0;
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const questions_1 = require("./questions");
const validation_1 = require("./validation");
class Form {
    constructor(formId) {
        this.formId = formId;
        this.questions = [];
    }
    addBinary(text) {
        const q = new questions_1.QuestionBinary(this.questions.length, text);
        this.questions.push(q);
    }
    addBinaryCustom(text, choiceA, choiceB) {
        const q = new questions_1.QuestionBinary(this.questions.length, text);
        q.setCustomChoices(choiceA, choiceB);
        this.questions.push(q);
    }
    addRating(text) {
        const q = new questions_1.QuestionRating(this.questions.length, text);
        this.questions.push(q);
    }
    addText(text) {
        const q = new questions_1.QuestionText(this.questions.length, text);
        this.questions.push(q);
    }
    toObject() {
        const qs = [];
        this.questions.forEach((q, i) => { qs.push(q.toObject()); });
        return ({
            formId: this.formId,
            questions: qs,
        });
    }
    isChanged(f) {
        return this.formId !== f.formId ||
            this.questions.some((q, i) => {
                if (f.questions.length > i) {
                    return q.isChanged(f.questions[i]);
                }
                else {
                    return true;
                }
            });
    }
    static fromObject(json) {
        const f = new Form(json.formId);
        json.questions.forEach((q, i) => { f.questions.push(questions_1.Question.fromObject(q)); });
        return f;
    }
    validateResponse(r) {
        const success = {};
        let validationResult = success;
        this.questions.forEach((q, i) => {
            const value = r.get(q.index);
            if (typeof value === "undefined") {
                const validationError = { reason: validation_1.VErrorReason.Missing, qIndex: q.index, value };
                validationResult = validationError;
            }
            else {
                try {
                    q.isValidResponse(value);
                }
                catch (e) {
                    let message = 'Unknown Error';
                    if (e instanceof Error)
                        message = e.message;
                    const validationError = { reason: message, qIndex: q.index, value: value };
                    validationResult = validationError;
                }
            }
        });
        return validationResult;
    }
}
__decorate([
    (0, class_transformer_1.Type)(type => questions_1.Question)
], Form.prototype, "questions", void 0);
exports.Form = Form;
;
