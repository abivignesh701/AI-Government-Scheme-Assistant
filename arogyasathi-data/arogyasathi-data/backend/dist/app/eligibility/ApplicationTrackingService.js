"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationTrackingService = exports.ApplicationTrackingService = void 0;
const ApplicationTrackingRepository_1 = require("../repositories/ApplicationTrackingRepository");
class ApplicationTrackingService {
    async getTrackingForScheme(ownerId, profileId, schemeId) {
        return ApplicationTrackingRepository_1.applicationTrackingRepository.getByCompositeKey(ownerId, profileId, schemeId);
    }
    async listTracking(ownerId) {
        return ApplicationTrackingRepository_1.applicationTrackingRepository.listForUser(ownerId);
    }
    async getTrackingById(trackingId, ownerId) {
        return ApplicationTrackingRepository_1.applicationTrackingRepository.getById(trackingId, ownerId);
    }
    async startTracking(ownerId, profileId, schemeId, evaluationId) {
        return ApplicationTrackingRepository_1.applicationTrackingRepository.createOrUpdate({
            owner_user_id: ownerId,
            profile_id: profileId,
            scheme_id: schemeId,
            evaluation_id: evaluationId,
            state: 'NOT_STARTED',
            checklist_state: {}
        });
    }
    async updateState(trackingId, ownerId, newState) {
        const existing = await this.getTrackingById(trackingId, ownerId);
        if (!existing)
            throw new Error('Tracking record not found');
        // Ensure valid state
        const validStates = [
            'NOT_STARTED', 'PREPARING_DOCUMENTS', 'REFERRED_TO_OFFICIAL_PORTAL',
            'USER_MARKED_SUBMITTED', 'AWAITING_OFFICIAL_UPDATE', 'USER_MARKED_COMPLETED', 'STOPPED'
        ];
        if (!validStates.includes(newState)) {
            throw new Error('Invalid tracking state');
        }
        return ApplicationTrackingRepository_1.applicationTrackingRepository.createOrUpdate({
            owner_user_id: ownerId,
            profile_id: existing.profile_id,
            scheme_id: existing.scheme_id,
            state: newState
        });
    }
    async updateChecklist(trackingId, ownerId, docId, status) {
        const existing = await this.getTrackingById(trackingId, ownerId);
        if (!existing)
            throw new Error('Tracking record not found');
        const checklist = existing.checklist_state || {};
        // Convert Mongoose map to plain object if needed, but Supabase JSONB returns plain object
        if (typeof checklist.get === 'function') {
            const plainObj = {};
            checklist.forEach((val, key) => plainObj[key] = val);
            plainObj[docId] = status;
            existing.checklist_state = plainObj;
        }
        else {
            checklist[docId] = status;
        }
        return ApplicationTrackingRepository_1.applicationTrackingRepository.createOrUpdate({
            owner_user_id: ownerId,
            profile_id: existing.profile_id,
            scheme_id: existing.scheme_id,
            checklist_state: checklist
        });
    }
}
exports.ApplicationTrackingService = ApplicationTrackingService;
exports.applicationTrackingService = new ApplicationTrackingService();
