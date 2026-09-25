"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewProfile = exports.updateProfile = exports.getCurrentProfile = exports.getProfile = exports.createProfile = void 0;
const CitizenProfileService_1 = require("../services/CitizenProfileService");
const CitizenProfileRepository_1 = require("../repositories/CitizenProfileRepository");
const createProfile = async (req, res) => {
    try {
        const { subject_type } = req.body;
        const ownerId = req.user.userId;
        if (!['SELF', 'SOMEONE_ELSE'].includes(subject_type)) {
            res.status(400).json({ error: { message: 'Invalid subject_type' } });
            return;
        }
        const profile = await CitizenProfileService_1.citizenProfileService.createDraft(ownerId, subject_type);
        res.status(201).json(profile);
    }
    catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
};
exports.createProfile = createProfile;
const getProfile = async (req, res) => {
    try {
        const ownerId = req.user.userId;
        const profileId = req.params.profile_id;
        const profile = await CitizenProfileRepository_1.citizenProfileRepository.getById(profileId, ownerId);
        if (!profile) {
            res.status(404).json({ error: { message: 'Profile not found' } });
            return;
        }
        res.json(profile);
    }
    catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
};
exports.getProfile = getProfile;
const getCurrentProfile = async (req, res) => {
    try {
        const ownerId = req.user.userId;
        const profile = await CitizenProfileRepository_1.citizenProfileRepository.getLatestForUser(ownerId);
        if (!profile) {
            res.status(404).json({ error: { message: 'Profile not found' } });
            return;
        }
        res.json(profile);
    }
    catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
};
exports.getCurrentProfile = getCurrentProfile;
const updateProfile = async (req, res) => {
    try {
        const ownerId = req.user.userId;
        const profileId = req.params.profile_id;
        const updates = req.body;
        const profile = await CitizenProfileService_1.citizenProfileService.updateDraft(profileId, ownerId, updates);
        if (!profile) {
            res.status(404).json({ error: { message: 'Profile not found' } });
            return;
        }
        res.json(profile);
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
exports.updateProfile = updateProfile;
const reviewProfile = async (req, res) => {
    try {
        const ownerId = req.user.userId;
        const profileId = req.params.profile_id;
        const profile = await CitizenProfileService_1.citizenProfileService.markReviewed(profileId, ownerId);
        if (!profile) {
            res.status(404).json({ error: { message: 'Profile not found' } });
            return;
        }
        res.json(profile);
    }
    catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
};
exports.reviewProfile = reviewProfile;
