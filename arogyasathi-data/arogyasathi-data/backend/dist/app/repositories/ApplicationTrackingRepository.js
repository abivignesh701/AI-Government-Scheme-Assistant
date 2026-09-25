"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationTrackingRepository = exports.ApplicationTrackingRepository = void 0;
const connection_1 = require("../database/connection");
class ApplicationTrackingRepository {
    async getByCompositeKey(ownerId, profileId, schemeId) {
        const { data, error } = await connection_1.supabase
            .from('application_trackings')
            .select('*')
            .eq('owner_user_id', ownerId)
            .eq('profile_id', profileId)
            .eq('scheme_id', schemeId)
            .maybeSingle();
        if (error)
            throw error;
        return data;
    }
    async getById(trackingId, ownerId) {
        const { data, error } = await connection_1.supabase
            .from('application_trackings')
            .select('*')
            .eq('id', trackingId)
            .eq('owner_user_id', ownerId)
            .maybeSingle();
        if (error)
            throw error;
        return data;
    }
    async listForUser(ownerId) {
        const { data, error } = await connection_1.supabase
            .from('application_trackings')
            .select('*')
            .eq('owner_user_id', ownerId)
            .order('updated_at', { ascending: false });
        if (error)
            throw error;
        return data || [];
    }
    async createOrUpdate(data) {
        const existing = await this.getByCompositeKey(data.owner_user_id, data.profile_id, data.scheme_id);
        const now = new Date().toISOString();
        if (existing) {
            const updates = {};
            if (data.state)
                updates.state = data.state;
            if (data.evaluation_id)
                updates.evaluation_id = data.evaluation_id;
            if (data.checklist_state)
                updates.checklist_state = data.checklist_state;
            if (data.external_reference_optional !== undefined)
                updates.external_reference_optional = data.external_reference_optional;
            if (data.user_notes_optional !== undefined)
                updates.user_notes_optional = data.user_notes_optional;
            updates.updated_at = now;
            updates.last_user_update_at = now;
            const { data: updated, error } = await connection_1.supabase
                .from('application_trackings')
                .update(updates)
                .eq('id', existing.id)
                .select()
                .single();
            if (error)
                throw error;
            return updated;
        }
        const insertData = {
            ...data,
            created_at: now,
            updated_at: now,
            last_user_update_at: now
        };
        const { data: inserted, error } = await connection_1.supabase
            .from('application_trackings')
            .insert(insertData)
            .select()
            .single();
        if (error)
            throw error;
        return inserted;
    }
}
exports.ApplicationTrackingRepository = ApplicationTrackingRepository;
exports.applicationTrackingRepository = new ApplicationTrackingRepository();
