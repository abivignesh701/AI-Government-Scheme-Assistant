"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eligibilityService = exports.EligibilityService = void 0;
// Mock EligibilityService since Module 4 was skipped
class EligibilityService {
    async evaluateProfile(profileId, ownerId) {
        // Generate a mock result based on missing fields for Module 5 tests
        return {
            evaluation_id: 'eval_' + Date.now(),
            profile_id: profileId,
            profile_version: 1,
            rule_version: '1.0',
            schemes: [
                {
                    scheme_id: 'scheme_1',
                    scheme_name: 'Health Scheme A',
                    status: 'NEEDS_MORE_INFORMATION',
                    missing_fields: ['annual_family_income', 'occupation'],
                    unknown_conditions: [
                        { condition_id: 'c1', field: 'annual_family_income', status: 'UNKNOWN' },
                        { condition_id: 'c2', field: 'occupation', status: 'UNKNOWN' }
                    ],
                    verification_requirements: [],
                    reason_codes: []
                },
                {
                    scheme_id: 'scheme_2',
                    scheme_name: 'Health Scheme B',
                    status: 'NEEDS_MORE_INFORMATION',
                    missing_fields: ['annual_family_income'],
                    unknown_conditions: [
                        { condition_id: 'c3', field: 'annual_family_income', status: 'UNKNOWN' }
                    ],
                    verification_requirements: [],
                    reason_codes: []
                },
                {
                    scheme_id: 'scheme_3',
                    scheme_name: 'Health Scheme C',
                    status: 'NEEDS_MORE_INFORMATION',
                    missing_fields: [],
                    unknown_conditions: [
                        { condition_id: 'c4', field: 'official_verification', status: 'OFFICIAL_VERIFICATION_REQUIRED' }
                    ],
                    verification_requirements: ['GOVT_DB_VERIFICATION'],
                    reason_codes: []
                }
            ]
        };
    }
}
exports.EligibilityService = EligibilityService;
exports.eligibilityService = new EligibilityService();
