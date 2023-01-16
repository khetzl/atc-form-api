export declare enum QuestionType {
    Binary = 0,
    Rating = 1,
    MultipleChoice = 2,
    Text = 3,
    Matrix = 4
}
type QMCChoice = {
    index: number;
    text: string;
};
type QMLine = {
    index: number;
    questionText: string;
};
export type QuestionJSON = QuestionBinaryJSON | QuestionRatingJSON | QuestionMultipleChoiceJSON | QuestionMatrixJSON | QuestionTextJSON;
type ResponseValueType = number | string;
export type MatrixResponseValue = Map<number, string | number>;
export type ReponseValue = string | number | MatrixResponseValue;
export declare class Question {
    index: number;
    questionType: QuestionType;
    questionText: string;
    constructor(index: number, questionType: QuestionType, questionText: string);
    isValidResponse(v: ResponseValueType): void;
    toObject(): QuestionJSON;
    static fromObject(json: QuestionJSON): Question;
}
export type QuestionBinaryJSON = {
    index: number;
    questionType: QuestionType;
    questionText: string;
    customChoiceA?: string;
    customChoiceB?: string;
};
export declare class QuestionBinary extends Question {
    customChoiceA?: string;
    customChoiceB?: string;
    constructor(index: number, questionText: string);
    setCustomChoices(a: string, b: string): void;
    isValidResponse(v: ResponseValueType): void;
    toObject(): QuestionBinaryJSON;
    static fromObject(json: QuestionBinaryJSON): QuestionBinary;
}
export type QuestionRatingJSON = {
    index: number;
    questionType: QuestionType;
    questionText: string;
    range: number;
};
export declare class QuestionRating extends Question {
    range: number;
    constructor(index: number, questionText: string);
    isValidResponse(v: ResponseValueType): void;
    setCustomRange(n: number): void;
    toObject(): QuestionRatingJSON;
    static fromObject(json: QuestionRatingJSON): QuestionRating;
}
export type QuestionMultipleChoiceJSON = {
    index: number;
    questionType: QuestionType;
    questionText: string;
};
export declare class QuestionMultipleChoice extends Question {
    isRandomOrder: boolean;
    choices: QMCChoice[];
    constructor(index: number, questionText: string);
    toObject(): QuestionMultipleChoiceJSON;
    static fromObject(json: QuestionMultipleChoiceJSON): QuestionMultipleChoice;
}
export type QuestionTextJSON = {
    index: number;
    questionType: QuestionType;
    questionText: string;
};
export declare class QuestionText extends Question {
    constructor(index: number, questionText: string);
    toObject(): QuestionTextJSON;
}
export type QuestionMatrixJSON = {
    index: number;
    questionType: QuestionType;
    questionText: string;
};
export declare class QuestionMatrix extends Question {
    lines: QMLine[];
    constructor(index: number, questionText: string);
    toObject(): QuestionMatrixJSON;
}
export {};
