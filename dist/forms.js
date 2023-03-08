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
const question_1 = require("./question");
const validation_1 = require("./validation");
class Form {
    constructor(formId, internalName, text) {
        this.formId = formId;
        this.formText = text;
        this.internalName = internalName;
        this.questions = [];
    }
    setText(formText) {
        this.formText = formText;
    }
    addBinary(text) {
        const q = new question_1.QuestionBinary(this.questions.length, text);
        this.questions.push(q);
    }
    addBinaryCustom(text, choiceA, choiceB) {
        const q = new question_1.QuestionBinary(this.questions.length, text);
        q.setCustomChoices(choiceA, choiceB);
        this.questions.push(q);
    }
    addRating(text) {
        const q = new question_1.QuestionRating(this.questions.length, text);
        this.questions.push(q);
    }
    addText(text) {
        const q = new question_1.QuestionText(this.questions.length, text);
        this.questions.push(q);
    }
    toSummary() {
        return {
            formId: this.formId,
            formText: this.formText,
            internalName: this.internalName,
        };
    }
    toObject() {
        const qs = [];
        this.questions.forEach((q, i) => { qs.push(q.toObject()); });
        return ({
            formId: this.formId,
            formText: this.formText,
            internalName: this.internalName,
            questions: qs,
        });
    }
    static fromObject(json) {
        const f = new Form(json.formId, json.internalName, json.formText);
        json.questions.forEach((q, i) => { f.questions.push(question_1.Question.fromObject(q)); });
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
    (0, class_transformer_1.Type)(() => question_1.Question)
], Form.prototype, "questions", void 0);
exports.Form = Form;
;
