import { VErrorReason } from './validation';

// FIXME: perhaps shared library
const defaultRatingRange = 10;

// FIXME: into shared library
export enum QuestionType {
    Binary,
    Rating,
    MultipleChoice,
    Text,
    Matrix
};


// Multiple Choice question choice.
export type QMCChoice = {
    index: number,
    text: string,
};

// Matrix question line.
export type QMLine = {
    index: number,
    questionText: string,
}

export type QuestionJSON = QuestionBinaryJSON | QuestionRatingJSON | QuestionMultipleChoiceJSON | QuestionMatrixJSON | QuestionTextJSON;

type ResponseValueType = number | string; // FIXME: to be extended

export type MatrixResponseValue = Map<number, string|number>;

export type ReponseValue = string | number | MatrixResponseValue;

export class Question {
    index: number;
    questionType: QuestionType; // This is to make it human readable in conversions. (not the best)
    questionText: string;

    constructor(index: number, questionType: QuestionType, questionText: string) {
        this.index=index;
        this.questionType=questionType;
        this.questionText=questionText;
    }

    isValidResponse(v: ResponseValueType) : void {
        return;
    };

    toObject() : QuestionJSON {
        return ({
            index: this.index,
            questionType: this.questionType,
            questionText: this.questionText,
        });
    }

    static fromObject(json: QuestionJSON) : Question {
        // FIXME: This seems to be pretty labour-intensive
        switch (json.questionType) {
            case QuestionType.Binary:
                return QuestionBinary.fromObject(json as QuestionBinaryJSON);
            case QuestionType.Rating:
                return QuestionRating.fromObject(json as QuestionRatingJSON);
            case QuestionType.MultipleChoice:
                return QuestionMultipleChoice.fromObject(json as QuestionMultipleChoiceJSON);
            case QuestionType.Text:
                return QuestionText.fromObject(json as QuestionTextJSON);
            case QuestionType.Matrix:
                return QuestionMatrix.fromObject(json as QuestionMatrixJSON);
            default:
                throw new Error("Unknown question type");
                break;
        }                
    }
}

export type QuestionBinaryJSON = {
    index: number,
    questionType: QuestionType,
    questionText: string,
    customChoiceA? : string,
    customChoiceB? : string,
}

export class QuestionBinary extends Question {
    customChoiceA?: string;
    customChoiceB?: string;   

    constructor(index: number, questionText: string) {
        super(index, QuestionType.Binary, questionText);
    }
    
    setCustomChoices(a: string, b: string) : void {
        this.customChoiceA = a;
        this.customChoiceB = b;
    }

    isValidResponse(v: ResponseValueType) : void {
        if (typeof v === "number") {
            if (v === 0 || v === 1) {
                return;
            }else{
                throw new Error(VErrorReason.OutOfBounds);
            }
        } else {
            throw new Error(VErrorReason.UnexpectedType);
        }
    }

    toObject() : QuestionBinaryJSON {
        return ({
            index: this.index,
            questionType: this.questionType,
            questionText: this.questionText,
            customChoiceA: this.customChoiceA,
            customChoiceB: this.customChoiceB,
        });
    }
    
    static fromObject(json: QuestionBinaryJSON) : QuestionBinary {
        const q = new QuestionBinary(json.index, json.questionText);
        if (json.customChoiceA && json.customChoiceB) {
            q.setCustomChoices(json.customChoiceA, json.customChoiceB);
        }
        return q;
    }
}

export type QuestionRatingJSON = {
    index: number,
    questionType: QuestionType,
    questionText: string,
    range: number,
};

export class QuestionRating extends Question {
    range: number;

    constructor(index: number, questionText: string) {
        super(index, QuestionType.Rating, questionText);
        this.range = defaultRatingRange;
    }

    isValidResponse(v: ResponseValueType) {
        // If a question gets updated when a user updates it, this might give weird results.
        if (typeof v === "number") {
            if ( v >= 0 && v < this.range) {
                return;
            } else {
                throw new Error(VErrorReason.OutOfBounds);
            }
        } else {
            throw new Error(VErrorReason.UnexpectedType);
        }
    }
    
    setCustomRange(n: number) : void { this.range = defaultRatingRange }

    toObject() : QuestionRatingJSON {
        return ({
            index: this.index,
            questionType: this.questionType,
            questionText: this.questionText,
            range: this.range,
        })
    }
    
    static fromObject(json: QuestionRatingJSON) : QuestionRating {
        const q = new QuestionRating(json.index, json.questionText);
        // FIXME: this is likely to crash
        
        q.range = json.range || defaultRatingRange;
        
        return q;
    }
}

export type QuestionMultipleChoiceJSON = {
    index: number,
    questionType: QuestionType,
    questionText: string,
    choices: QMCChoice[],
};

export class QuestionMultipleChoice extends Question {
    isRandomOrder = false;
    choices: QMCChoice[] = [];

    constructor(index: number, questionText: string) {
        super(index, QuestionType.MultipleChoice, questionText);
    }
    
    toObject() : QuestionMultipleChoiceJSON {
        return ({
            index: this.index,
            questionType: this.questionType,
            questionText: this.questionText,
            choices: this.choices
        })
    }
    
    static fromObject(json: QuestionMultipleChoiceJSON) : QuestionMultipleChoice {
        const q = new QuestionMultipleChoice(json.index, json.questionText);
        q.choices = json.choices;
        return q;
    }
}

export type QuestionTextJSON = {
    index: number,
    questionType: QuestionType,
    questionText: string,
};

export class QuestionText extends Question {
    constructor (index: number, questionText: string) {
        super(index, QuestionType.Text, questionText);
    }

    toObject() : QuestionTextJSON {
        return ({
            index: this.index,
            questionType: this.questionType,
            questionText: this.questionText,
        })
    }

    static fromObject(json: QuestionTextJSON) : QuestionText {
        const q = new QuestionText(json.index, json.questionText);
        return q;
    }
}

export type QuestionMatrixJSON = {
    index: number,
    questionType: QuestionType,
    questionText: string,
};

export class QuestionMatrix extends Question {
    lines: QMLine[] = [];

    constructor (index: number, questionText: string) {
        super(index, QuestionType.Matrix, questionText);
    }

    toObject() : QuestionMatrixJSON {
        return ({
            index: this.index,
            questionType: this.questionType,
            questionText: this.questionText,
        })
    }

}
