"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Form = void 0;
const question_1 = require("./question");
const validation_1 = require("./validation");
class Form {
    constructor(campaignId, formId, campaignText) {
        this.campaignId = campaignId;
        this.campaignText = campaignText;
        this.formId = formId;
        this.questions = [];
    }
    setText(campaignText) {
        this.campaignText = campaignText;
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
    validateResponse(r) {
        const success = {};
        let validationResult = success;
        this.questions.forEach((q, i) => {
            const value = r.get(q.index.toString());
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
exports.Form = Form;
;
