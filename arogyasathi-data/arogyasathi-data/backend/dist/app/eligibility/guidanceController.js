"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChecklist = exports.getTracking = exports.listTracking = exports.updateTrackingState = exports.startTracking = exports.getGuidance = void 0;
const ApplicationGuidanceService_1 = require("./ApplicationGuidanceService");
const ApplicationTrackingService_1 = require("./ApplicationTrackingService");
const EligibilityService_1 = require("./EligibilityService");
const CitizenProfileRepository_1 = require("../repositories/CitizenProfileRepository");
const getGuidance = async (req, res) => {
    try {
        const ownerId = req.user.userId;
        const schemeId = req.params.scheme_id;
        // In real app, we need to find the user's active profile and evaluation. 
        // Here we'll mock loading the dummy profile and evaluating it to match Module 6.
        const profile = await CitizenProfileRepository_1.citizenProfileRepository.getLatestForUser(ownerId);
        if (!profile) {
            res.status(404).json({ error: { message: 'Profile not found' } });
            return;
        }
        const evaluation = await EligibilityService_1.eligibilityService.evaluateProfile(profile.id, ownerId);
        const schemeResult = evaluation.schemes.find(s => s.scheme_id === schemeId);
        if (!schemeResult) {
            res.status(404).json({ error: { message: 'Scheme evaluation not found' } });
            return;
        }
        const guidance = ApplicationGuidanceService_1.applicationGuidanceService.getGuidance(schemeResult, profile, evaluation.evaluation_id);
        res.json(guidance);
    }
    catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
};
exports.getGuidance = getGuidance;
const startTracking = async (req, res) => {
    try {
        const ownerId = req.user.userId;
        const { profile_id, scheme_id, evaluation_id } = req.body;
        if (!profile_id || !scheme_id || !evaluation_id) {
            res.status(400).json({ error: { message: 'Missing required tracking fields' } });
            return;
        }
        const tracking = await ApplicationTrackingService_1.applicationTrackingService.startTracking(ownerId, profile_id, scheme_id, evaluation_id);
        res.json(tracking);
    }
    catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
};
exports.startTracking = startTracking;
const updateTrackingState = async (req, res) => {
    try {
        const ownerId = req.user.userId;
        const trackingId = req.params.tracking_id;
        const { state } = req.body;
        if (!state) {
            res.status(400).json({ error: { message: 'Missing state' } });
            return;
        }
        const tracking = await ApplicationTrackingService_1.applicationTrackingService.updateState(trackingId, ownerId, state);
        res.json(tracking);
    }
    catch (error) {
        if (error.message === 'Invalid tracking state' || error.message === 'Tracking record not found') {
            res.status(400).json({ error: { message: error.message } });
            return;
        }
        res.status(500).json({ error: { message: error.message } });
    }
};
exports.updateTrackingState = updateTrackingState;
const listTracking = async (req, res) => {
    try {
        const ownerId = req.user.userId;
        const trackings = await ApplicationTrackingService_1.applicationTrackingService.listTracking(ownerId);
        res.json(trackings);
    }
    catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
};
exports.listTracking = listTracking;
const getTracking = async (req, res) => {
    try {
        const ownerId = req.user.userId;
        const trackingId = req.params.tracking_id;
        const tracking = await ApplicationTrackingService_1.applicationTrackingService.getTrackingById(trackingId, ownerId);
        if (!tracking) {
            res.status(404).json({ error: { message: 'Tracking record not found' } });
            return;
        }
        res.json(tracking);
    }
    catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
};
exports.getTracking = getTracking;
const updateChecklist = async (req, res) => {
    try {
        const ownerId = req.user.userId;
        const trackingId = req.params.tracking_id;
        const { doc_id, status } = req.body;
        if (!doc_id || !status) {
            res.status(400).json({ error: { message: 'Missing doc_id or status' } });
            return;
        }
        const tracking = await ApplicationTrackingService_1.applicationTrackingService.updateChecklist(trackingId, ownerId, doc_id, status);
        res.json(tracking);
    }
    catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
};
exports.updateChecklist = updateChecklist;
