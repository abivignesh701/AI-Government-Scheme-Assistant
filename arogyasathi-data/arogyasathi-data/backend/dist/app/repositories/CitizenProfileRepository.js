"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.citizenProfileRepository = exports.CitizenProfileRepository = void 0;
const connection_1 = require("../database/connection");
class CitizenProfileRepository {
    async create(data) {
        const { data: profile, error } = await connection_1.supabase
            .from('citizen_profiles')
            .insert(data)
            .select()
            .single();
        if (error)
            throw error;
        return profile;
    }
    async getById(id, ownerId) {
        const { data: profile, error } = await connection_1.supabase
            .from('citizen_profiles')
            .select('*')
            .eq('id', id)
            .eq('owner_user_id', ownerId)
            .maybeSingle();
        if (error)
            throw error;
        return profile;
    }
    async getLatestForUser(ownerId) {
        const { data: profile, error } = await connection_1.supabase
            .from('citizen_profiles')
            .select('*')
            .eq('owner_user_id', ownerId)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        if (error)
            throw error;
        return profile;
    }
    async update(id, ownerId, data) {
        // Note: To increment profile_version we fetch first, or we assume data contains updated version.
        // For simplicity, we let the caller pass the new version or just update what's passed.
        // We should probably get current version and increment it, but usually update data has it.
        // Assuming `data` contains the fields to update:
        const { data: updatedProfile, error } = await connection_1.supabase
            .from('citizen_profiles')
            .update(data)
            .eq('id', id)
            .eq('owner_user_id', ownerId)
            .select()
            .maybeSingle();
        if (error)
            throw error;
        return updatedProfile;
    }
    async delete(id, ownerId) {
        const { count, error } = await connection_1.supabase
            .from('citizen_profiles')
            .delete({ count: 'exact' })
            .eq('id', id)
            .eq('owner_user_id', ownerId);
        if (error)
            throw error;
        return count === 1;
    }
}
exports.CitizenProfileRepository = CitizenProfileRepository;
exports.citizenProfileRepository = new CitizenProfileRepository();
