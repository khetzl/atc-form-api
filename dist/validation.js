"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuccess = exports.VErrorReason = void 0;
var VErrorReason;
(function (VErrorReason) {
    VErrorReason["Missing"] = "value undefined for key";
    VErrorReason["UnexpectedType"] = "unexpected type";
    VErrorReason["OutOfBounds"] = "out of bounds";
})(VErrorReason = exports.VErrorReason || (exports.VErrorReason = {}));
;
function isSuccess(v) {
    if (v.reason) {
        return false;
    }
    return true;
}
exports.isSuccess = isSuccess;
