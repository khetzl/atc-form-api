import { VErrorReason } from './validation';

// FIXME: into shared library
export enum QuestionType {
    Binary,
    Rating,
    MultipleChoice,
    Text,
    Matrix
};


// Multiple Choice question choice.
type QMCChoice = {
    index: number,
    text: string,
};

// Matrix question line.
type QMLine = {
    index: number,
    questionText: string,
}

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
}

export class QuestionRating extends Question {
    range = 10;

    constructor(index: number, questionText: string) {
        super(index, QuestionType.Rating, questionText);
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
    setCustomRange(n: number) : void { this.range = n }
}

export class QuestionMultipleChoice extends Question {
    isRandomOrder = false;
    choices: QMCChoice[] = [];
}

export class QuestionText extends Question {
    constructor (index: number, questionText: string) {
        super(index, QuestionType.Text, questionText);
    }
}

export class QuestionMatrix extends Question {
    lines: QMLine[] = [];
}
