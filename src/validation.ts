export type ValidationSuccess = {};

export enum VErrorReason {
    Missing = 'value undefined for key',
    UnexpectedType = 'unexpected type',
    OutOfBounds = 'out of bounds',
};

export type ValidationError = {
    reason: string, //VErrorReason,
    qIndex: number,
    value: any,
};

export type ValidationResult = ValidationError | ValidationSuccess;

export function isSuccess(v: ValidationError | ValidationSuccess) : boolean {
    if( (v as ValidationError).reason ){
        return false;
    }
    return true;
}
