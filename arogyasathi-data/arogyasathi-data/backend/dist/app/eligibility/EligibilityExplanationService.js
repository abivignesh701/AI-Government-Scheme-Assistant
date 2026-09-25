"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eligibilityExplanationService = exports.EligibilityExplanationService = void 0;
// Mock knowledge base since previous modules didn't create a real MongoDB scheme collection
const MockSchemesDB = {
    'scheme_1': {
        benefits: [
            { id: 'b1', category: 'FINANCIAL_COVERAGE', description: 'Up to ₹5,00,000 for medical expenses', amount: 500000, sources: [] }
        ],
        documents: [
            { id: 'd1', name: 'Income Certificate', category: 'REQUIRED' }
        ],
        sources: [
            { id: 's1', title: 'Official Scheme Portal', authority: 'Ministry of Health', url: 'https://example.gov.in/scheme1', last_verified: '2026-09-01' }
        ]
    },
    'scheme_2': {
        benefits: [
            { id: 'b2', category: 'CASHLESS_TREATMENT', description: 'Cashless treatment at empaneled hospitals', sources: [] }
        ],
        documents: [],
        sources: []
    },
    'scheme_3': {
        benefits: [],
        documents: [],
        sources: []
    }
};
class EligibilityExplanationService {
    explain(evaluation, isCaregiver = false) {
        return evaluation.schemes.map(scheme => this.explainScheme(scheme, isCaregiver));
    }
    explainScheme(scheme, isCaregiver) {
        const knowledge = MockSchemesDB[scheme.scheme_id] || { benefits: [], documents: [], sources: [] };
        let headline = '';
        let summary = '';
        let next_action = { type: 'NONE', label: '' };
        let main_failure_reason = undefined;
        if (scheme.status === 'MATCH') {
            headline = isCaregiver
                ? "This scheme matches the information entered for the person you're helping."
                : "This scheme matches the information you provided.";
            summary = "Based on verified rules, you meet all known criteria. Final enrollment and beneficiary verification are handled by the official government system.";
            next_action = { type: 'APPLY_NOW', label: 'View Application Guidance' };
        }
        else if (scheme.status === 'NEEDS_MORE_INFORMATION') {
            headline = "We need more information or verification to complete this check.";
            if (scheme.unknown_conditions.some(c => c.status === 'OFFICIAL_VERIFICATION_REQUIRED')) {
                summary = "Official verification is still required.";
                next_action = { type: 'VIEW_VERIFICATION', label: 'View verification guidance' };
            }
            else {
                summary = "We are missing a few details to determine eligibility.";
                next_action = { type: 'ANSWER_QUESTIONS', label: 'Answer remaining questions' };
            }
        }
        else if (scheme.status === 'NOT_MATCHED') {
            headline = "This scheme does not currently match the information provided.";
            summary = "Based on the verified rules, one or more conditions were not met.";
            next_action = { type: 'EXPLORE_ALTERNATIVES', label: 'Explore Alternatives' };
            // Determine main reason
            if (scheme.reason_codes && scheme.reason_codes.length > 0) {
                main_failure_reason = this.translateReasonCode(scheme.reason_codes[0]);
            }
            else if (scheme.unknown_conditions.some(c => c.status === 'NOT_MET')) {
                const firstFailed = scheme.unknown_conditions.find(c => c.status === 'NOT_MET');
                main_failure_reason = `The condition for ${firstFailed?.field} was not met.`;
            }
            else {
                main_failure_reason = "Eligibility requirements were not satisfied.";
            }
        }
        const matched = [];
        const failed = [];
        const unknown = [];
        const verification = [];
        // Categorize conditions (assuming they are in unknown_conditions array or we synthesize them)
        scheme.unknown_conditions.forEach(cond => {
            const exp = {
                field: cond.field,
                status: cond.status,
                explanation: this.translateCondition(cond)
            };
            if (cond.status === 'MET')
                matched.push(exp);
            else if (cond.status === 'NOT_MET')
                failed.push(exp);
            else if (cond.status === 'UNKNOWN')
                unknown.push(exp);
            else if (cond.status === 'OFFICIAL_VERIFICATION_REQUIRED')
                verification.push(exp);
        });
        // If reason_codes present, map to failed conditions
        (scheme.reason_codes || []).forEach(rc => {
            failed.push({
                field: 'rule',
                status: 'NOT_MET',
                explanation: this.translateReasonCode(rc)
            });
        });
        return {
            scheme_id: scheme.scheme_id,
            scheme_name: scheme.scheme_name,
            status: scheme.status,
            headline,
            summary,
            main_failure_reason,
            matched_conditions: matched,
            failed_conditions: failed,
            unknown_conditions: unknown,
            verification_requirements: verification,
            benefits: knowledge.benefits,
            documents: knowledge.documents,
            sources: knowledge.sources,
            next_action
        };
    }
    translateCondition(cond) {
        const fieldName = cond.field.replace(/_/g, ' ');
        switch (cond.status) {
            case 'MET': return `${fieldName} requirement matched.`;
            case 'NOT_MET': return `${fieldName} condition did not match.`;
            case 'UNKNOWN': return `${fieldName} is not known.`;
            case 'OFFICIAL_VERIFICATION_REQUIRED': return `${fieldName} must be confirmed through official systems.`;
        }
    }
    translateReasonCode(code) {
        if (code === 'AGE_BELOW_MINIMUM')
            return 'The scheme requires a minimum age that is higher than the age entered.';
        if (code === 'INCOME_ABOVE_MAXIMUM')
            return 'Annual family income must be below the scheme\'s threshold.';
        return `Condition failed: ${code}`;
    }
}
exports.EligibilityExplanationService = EligibilityExplanationService;
exports.eligibilityExplanationService = new EligibilityExplanationService();
