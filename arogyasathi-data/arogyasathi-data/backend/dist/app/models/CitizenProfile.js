"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitizenProfile = exports.ProfileStatus = exports.SubjectType = exports.FieldStatus = void 0;
var FieldStatus;
(function (FieldStatus) {
    FieldStatus["KNOWN"] = "KNOWN";
    FieldStatus["UNKNOWN"] = "UNKNOWN";
    FieldStatus["NOT_APPLICABLE"] = "NOT_APPLICABLE";
})(FieldStatus || (exports.FieldStatus = FieldStatus = {}));
var SubjectType;
(function (SubjectType) {
    SubjectType["SELF"] = "SELF";
    SubjectType["SOMEONE_ELSE"] = "SOMEONE_ELSE";
})(SubjectType || (exports.SubjectType = SubjectType = {}));
var ProfileStatus;
(function (ProfileStatus) {
    ProfileStatus["DRAFT"] = "DRAFT";
    ProfileStatus["REVIEWED"] = "REVIEWED";
    ProfileStatus["READY_FOR_EVALUATION"] = "READY_FOR_EVALUATION";
})(ProfileStatus || (exports.ProfileStatus = ProfileStatus = {}));
// Stub for backward compatibility in imports
exports.CitizenProfile = {
// We remove findOne etc as it's now handled by the repository using supabase.
};
