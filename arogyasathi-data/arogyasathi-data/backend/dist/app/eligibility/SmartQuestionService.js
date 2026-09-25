"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smartQuestionService = exports.SmartQuestionService = exports.QuestionTemplateRegistry = void 0;
exports.QuestionTemplateRegistry = {
    annual_family_income: { input_type: 'currency' },
    occupation: { input_type: 'select' },
    state: { input_type: 'select' },
    district: { input_type: 'select' },
    family_size: { input_type: 'number' },
    existing_health_coverage: { input_type: 'boolean' }
};
class SmartQuestionService {
    generatePlan(eligibilityResult) {
        const fieldImpacts = {};
        eligibilityResult.schemes.forEach(scheme => {
            if (scheme.status === 'NEEDS_MORE_INFORMATION' && scheme.missing_fields.length > 0) {
                // Collect user-answerable missing fields
                scheme.missing_fields.forEach(field => {
                    if (!fieldImpacts[field]) {
                        fieldImpacts[field] = [];
                    }
                    fieldImpacts[field].push(scheme.scheme_id);
                });
            }
        });
        const questions = [];
        for (const [field, affectedSchemes] of Object.entries(fieldImpacts)) {
            const template = exports.QuestionTemplateRegistry[field] || { input_type: 'text' };
            questions.push({
                question_id: `q_${field}`,
                field: field,
                input_type: template.input_type,
                required_for_resolution: true,
                affected_scheme_ids: affectedSchemes,
                priority: affectedSchemes.length // Priority = number of affected schemes
            });
        }
        // Sort questions by priority descending
        questions.sort((a, b) => b.priority - a.priority);
        return {
            evaluation_id: eligibilityResult.evaluation_id,
            profile_id: eligibilityResult.profile_id,
            questions
        };
    }
}
exports.SmartQuestionService = SmartQuestionService;
exports.smartQuestionService = new SmartQuestionService();
