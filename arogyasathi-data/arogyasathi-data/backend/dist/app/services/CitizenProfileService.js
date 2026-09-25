"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.citizenProfileService = exports.CitizenProfileService = void 0;
const CitizenProfileRepository_1 = require("../repositories/CitizenProfileRepository");
const CitizenProfile_1 = require("../models/CitizenProfile");
class CitizenProfileService {
    async createDraft(ownerId, subjectType) {
        return await CitizenProfileRepository_1.citizenProfileRepository.create({
            owner_user_id: ownerId,
            subject_type: subjectType,
            status: CitizenProfile_1.ProfileStatus.DRAFT,
            profile_version: 1
        });
    }
    async updateDraft(id, ownerId, updates) {
        const errors = this.validateCrossFields(updates);
        if (errors.length > 0) {
            throw new Error(`Validation failed: ${errors.join(', ')}`);
        }
        return await CitizenProfileRepository_1.citizenProfileRepository.update(id, ownerId, updates);
    }
    async markReviewed(id, ownerId) {
        return await CitizenProfileRepository_1.citizenProfileRepository.update(id, ownerId, { status: CitizenProfile_1.ProfileStatus.REVIEWED });
    }
    validateCrossFields(updates) {
        const errors = [];
        // Validation: age >= 0
        if (updates.age?.status === CitizenProfile_1.FieldStatus.KNOWN && updates.age.value < 0) {
            errors.push('Age cannot be negative');
        }
        // Validation: family_size >= 1
        if (updates.family_size?.status === CitizenProfile_1.FieldStatus.KNOWN && updates.family_size.value < 1) {
            errors.push('Family size must be at least 1');
        }
        // Validation: income >= 0
        if (updates.annual_family_income?.status === CitizenProfile_1.FieldStatus.KNOWN && updates.annual_family_income.value < 0) {
            errors.push('Income cannot be negative');
        }
        return errors;
    }
}
exports.CitizenProfileService = CitizenProfileService;
exports.citizenProfileService = new CitizenProfileService();
