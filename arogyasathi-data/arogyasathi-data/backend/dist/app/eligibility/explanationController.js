"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemeDetail = exports.getExplanations = void 0;
const EligibilityService_1 = require("./EligibilityService");
const EligibilityExplanationService_1 = require("./EligibilityExplanationService");
const CitizenProfileRepository_1 = require("../repositories/CitizenProfileRepository");
const getExplanations = async (req, res) => {
    try {
        const ownerId = req.user.userId;
        const profileId = req.params.profile_id;
        const profile = await CitizenProfileRepository_1.citizenProfileRepository.getById(profileId, ownerId);
        if (!profile) {
            res.status(404).json({ error: { message: 'Profile not found' } });
            return;
        }
        // Evaluate
        const evaluation = await EligibilityService_1.eligibilityService.evaluateProfile(profileId, ownerId);
        // Check if result is stale (in a real app, compare profile version)
        const isStale = profile.version && evaluation.profile_version !== profile.version;
        // Explain
        const isCaregiver = profile.subject_type === 'SOMEONE_ELSE';
        const explanations = EligibilityExplanationService_1.eligibilityExplanationService.explain(evaluation, isCaregiver);
        // Get alternatives for NOT_MATCHED
        const result = {
            is_stale: isStale,
            explanations: explanations.map(exp => {
                if (exp.status === 'NOT_MATCHED') {
                    // Find alternatives (MATCH or NEEDS_MORE_INFO)
                    const alternatives = explanations
                        .filter(alt => alt.scheme_id !== exp.scheme_id && (alt.status === 'MATCH' || alt.status === 'NEEDS_MORE_INFORMATION'))
                        .slice(0, 3)
                        .map(alt => ({
                        scheme_id: alt.scheme_id,
                        scheme_name: alt.scheme_name,
                        status: alt.status
                    }));
                    return { ...exp, alternatives };
                }
                return exp;
            })
        };
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
};
exports.getExplanations = getExplanations;
const getSchemeDetail = async (req, res) => {
    try {
        const schemeId = req.params.scheme_id;
        // Mock fetching scheme detail
        const mockSchemeResult = await EligibilityService_1.eligibilityService.evaluateProfile('dummy', 'dummy');
        const scheme = mockSchemeResult.schemes.find(s => s.scheme_id === schemeId);
        if (!scheme) {
            res.status(404).json({ error: { message: 'Scheme not found' } });
            return;
        }
        const explanation = EligibilityExplanationService_1.eligibilityExplanationService.explain({
            evaluation_id: 'mock',
            profile_id: 'mock',
            profile_version: 1,
            rule_version: '1',
            schemes: [scheme]
        }, false)[0];
        res.json(explanation);
    }
    catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
};
exports.getSchemeDetail = getSchemeDetail;
