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
type ResponseValueType = number | string;
export type MatrixResponseValue = Map<number, string | number>;
export type ReponseValue = string | number | MatrixResponseValue;
export declare class Question {
    index: number;
    questionType: QuestionType;
    questionText: string;
    constructor(index: number, questionType: QuestionType, questionText: string);
    isValidResponse(v: ResponseValueType): void;
}
export declare class QuestionBinary extends Question {
    customChoiceA?: string;
    customChoiceB?: string;
    constructor(index: number, questionText: string);
    setCustomChoices(a: string, b: string): void;
    isValidResponse(v: ResponseValueType): void;
}
export declare class QuestionRating extends Question {
    range: number;
    constructor(index: number, questionText: string);
    isValidResponse(v: ResponseValueType): void;
    setCustomRange(n: number): void;
}
export declare class QuestionMultipleChoice extends Question {
    isRandomOrder: boolean;
    choices: QMCChoice[];
}
export declare class QuestionText extends Question {
    constructor(index: number, questionText: string);
}
export declare class QuestionMatrix extends Question {
    lines: QMLine[];
}
export {};
