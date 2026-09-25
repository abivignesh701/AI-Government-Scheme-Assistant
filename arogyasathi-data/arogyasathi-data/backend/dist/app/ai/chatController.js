"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChat = void 0;
const AIServiceClient_1 = require("./AIServiceClient");
const EligibilityService_1 = require("../eligibility/EligibilityService");
const CitizenProfileRepository_1 = require("../repositories/CitizenProfileRepository");
const handleChat = async (req, res) => {
    try {
        const ownerId = req.user.userId;
        const { message, language, scheme_id, conversation_id } = req.body;
        if (!message) {
            res.status(400).json({ error: { message: 'Missing message' } });
            return;
        }
        let evaluationContext = null;
        // Auto-resolve evaluation context if scheme is specified
        if (scheme_id) {
            const profile = await CitizenProfileRepository_1.citizenProfileRepository.getLatestForUser(ownerId);
            if (profile) {
                const evaluation = await EligibilityService_1.eligibilityService.evaluateProfile(profile.id, ownerId);
                const schemeResult = evaluation.schemes.find(s => s.scheme_id === scheme_id);
                if (schemeResult) {
                    evaluationContext = {
                        evaluation_id: evaluation.evaluation_id,
                        status: schemeResult.status,
                        unknown_conditions: schemeResult.unknown_conditions
                    };
                }
            }
        }
        const aiRequest = {
            message,
            language: language || 'en',
            conversation_id: conversation_id || 'session-' + Date.now(),
            scheme_id,
            evaluation_context: evaluationContext
        };
        const response = await AIServiceClient_1.aiServiceClient.chat(aiRequest);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
};
exports.handleChat = handleChat;
