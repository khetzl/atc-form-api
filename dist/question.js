"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionMatrix = exports.QuestionText = exports.QuestionMultipleChoice = exports.QuestionRating = exports.QuestionBinary = exports.Question = exports.QuestionType = void 0;
const validation_1 = require("./validation");
// FIXME: into shared library
var QuestionType;
(function (QuestionType) {
    QuestionType[QuestionType["Binary"] = 0] = "Binary";
    QuestionType[QuestionType["Rating"] = 1] = "Rating";
    QuestionType[QuestionType["MultipleChoice"] = 2] = "MultipleChoice";
    QuestionType[QuestionType["Text"] = 3] = "Text";
    QuestionType[QuestionType["Matrix"] = 4] = "Matrix";
})(QuestionType = exports.QuestionType || (exports.QuestionType = {}));
;
class Question {
    constructor(index, questionType, questionText) {
        this.index = index;
        this.questionType = questionType;
        this.questionText = questionText;
    }
    isValidResponse(v) {
        return;
    }
    ;
}
exports.Question = Question;
class QuestionBinary extends Question {
    constructor(index, questionText) {
        super(index, QuestionType.Binary, questionText);
    }
    setCustomChoices(a, b) {
        this.customChoiceA = a;
        this.customChoiceB = b;
    }
    isValidResponse(v) {
        if (typeof v === "number") {
            if (v === 0 || v === 1) {
                return;
            }
            else {
                throw new Error(validation_1.VErrorReason.OutOfBounds);
            }
        }
        else {
            throw new Error(validation_1.VErrorReason.UnexpectedType);
        }
    }
}
exports.QuestionBinary = QuestionBinary;
class QuestionRating extends Question {
    constructor(index, questionText) {
        super(index, QuestionType.Rating, questionText);
        this.range = 10;
    }
    isValidResponse(v) {
        // If a question gets updated when a user updates it, this might give weird results.
        if (typeof v === "number") {
            if (v >= 0 && v < this.range) {
                return;
            }
            else {
                throw new Error(validation_1.VErrorReason.OutOfBounds);
            }
        }
        else {
            throw new Error(validation_1.VErrorReason.UnexpectedType);
        }
    }
    setCustomRange(n) { this.range = n; }
}
exports.QuestionRating = QuestionRating;
class QuestionMultipleChoice extends Question {
    constructor() {
        super(...arguments);
        this.isRandomOrder = false;
        this.choices = [];
    }
}
exports.QuestionMultipleChoice = QuestionMultipleChoice;
class QuestionText extends Question {
    constructor(index, questionText) {
        super(index, QuestionType.Text, questionText);
    }
}
exports.QuestionText = QuestionText;
class QuestionMatrix extends Question {
    constructor() {
        super(...arguments);
        this.lines = [];
    }
}
exports.QuestionMatrix = QuestionMatrix;
