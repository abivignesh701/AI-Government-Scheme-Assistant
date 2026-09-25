"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerQuestion = exports.getQuestionPlan = void 0;
const EligibilityService_1 = require("./EligibilityService");
const SmartQuestionService_1 = require("./SmartQuestionService");
const CitizenProfileService_1 = require("../services/CitizenProfileService");
const CitizenProfileRepository_1 = require("../repositories/CitizenProfileRepository");
const getQuestionPlan = async (req, res) => {
    try {
        const ownerId = req.user.userId;
        const profileId = req.params.profile_id;
        // Check ownership
        const profile = await CitizenProfileRepository_1.citizenProfileRepository.getById(profileId, ownerId);
        if (!profile) {
            res.status(404).json({ error: { message: 'Profile not found' } });
            return;
        }
        const evaluation = await EligibilityService_1.eligibilityService.evaluateProfile(profileId, ownerId);
        const plan = SmartQuestionService_1.smartQuestionService.generatePlan(evaluation);
        res.json(plan);
    }
    catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
};
exports.getQuestionPlan = getQuestionPlan;
const answerQuestion = async (req, res) => {
    try {
        const ownerId = req.user.userId;
        const profileId = req.params.profile_id;
        const { field, value, status } = req.body;
        const profile = await CitizenProfileRepository_1.citizenProfileRepository.getById(profileId, ownerId);
        if (!profile) {
            res.status(404).json({ error: { message: 'Profile not found' } });
            return;
        }
        // Allowed fields for questions
        const allowedFields = ['annual_family_income', 'occupation', 'state', 'district', 'family_size', 'existing_health_coverage'];
        if (!allowedFields.includes(field)) {
            res.status(400).json({ error: { message: 'Invalid or restricted field' } });
            return;
        }
        const updates = {
            [field]: {
                value: status === 'UNKNOWN' ? null : value,
                status: status === 'UNKNOWN' ? 'UNKNOWN' : 'KNOWN',
                source: 'USER_CONFIRMED'
            }
        };
        // Update profile
        await CitizenProfileService_1.citizenProfileService.updateDraft(profileId, ownerId, updates);
        // Re-evaluate
        const newEvaluation = await EligibilityService_1.eligibilityService.evaluateProfile(profileId, ownerId);
        const newPlan = SmartQuestionService_1.smartQuestionService.generatePlan(newEvaluation);
        // Send back the new plan and evaluation results
        res.json({
            evaluation: newEvaluation,
            plan: newPlan
        });
    }
    catch (error) {
        if (error.message.startsWith('Validation failed')) {
            res.status(400).json({ error: { message: error.message } });
        }
        else {
            res.status(500).json({ error: { message: error.message } });
        }
    }
};
exports.answerQuestion = answerQuestion;
