import { ICitizenProfile } from '../models/CitizenProfile';
import { supabase } from '../database/connection';

export class CitizenProfileRepository {
  async create(data: Partial<ICitizenProfile>): Promise<ICitizenProfile> {
    const { data: profile, error } = await supabase
      .from('citizen_profiles')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return profile as ICitizenProfile;
  }

  async getById(id: string, ownerId: string): Promise<ICitizenProfile | null> {
    const { data: profile, error } = await supabase
      .from('citizen_profiles')
      .select('*')
      .eq('id', id)
      .eq('owner_user_id', ownerId)
      .maybeSingle();
      
    if (error) throw error;
    return profile as ICitizenProfile | null;
  }

  async getLatestForUser(ownerId: string): Promise<ICitizenProfile | null> {
    const { data: profile, error } = await supabase
      .from('citizen_profiles')
      .select('*')
      .eq('owner_user_id', ownerId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return profile as ICitizenProfile | null;
  }

  async update(id: string, ownerId: string, data: Partial<ICitizenProfile>): Promise<ICitizenProfile | null> {
    // Note: To increment profile_version we fetch first, or we assume data contains updated version.
    // For simplicity, we let the caller pass the new version or just update what's passed.
    
    // We should probably get current version and increment it, but usually update data has it.
    // Assuming `data` contains the fields to update:
    const { data: updatedProfile, error } = await supabase
      .from('citizen_profiles')
      .update(data)
      .eq('id', id)
      .eq('owner_user_id', ownerId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return updatedProfile as ICitizenProfile | null;
  }

  async delete(id: string, ownerId: string): Promise<boolean> {
    const { count, error } = await supabase
      .from('citizen_profiles')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('owner_user_id', ownerId);
      
    if (error) throw error;
    return count === 1;
  }
}

export const citizenProfileRepository = new CitizenProfileRepository();
