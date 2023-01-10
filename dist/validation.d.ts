export type ValidationSuccess = {};
export declare enum VErrorReason {
    Missing = "value undefined for key",
    UnexpectedType = "unexpected type",
    OutOfBounds = "out of bounds"
}
export type ValidationError = {
    reason: string;
    qIndex: number;
    value: any;
};
export type ValidationResult = ValidationError | ValidationSuccess;
export declare function isSuccess(v: ValidationError | ValidationSuccess): boolean;
