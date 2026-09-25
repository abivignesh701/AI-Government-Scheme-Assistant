import { IApplicationTracking, ApplicationTrackingState } from '../models/ApplicationTracking';
import { supabase } from '../database/connection';

export class ApplicationTrackingRepository {
  public async getByCompositeKey(ownerId: string, profileId: string, schemeId: string): Promise<IApplicationTracking | null> {
    const { data, error } = await supabase
      .from('application_trackings')
      .select('*')
      .eq('owner_user_id', ownerId)
      .eq('profile_id', profileId)
      .eq('scheme_id', schemeId)
      .maybeSingle();

    if (error) throw error;
    return data as IApplicationTracking | null;
  }

  public async getById(trackingId: string, ownerId: string): Promise<IApplicationTracking | null> {
    const { data, error } = await supabase
      .from('application_trackings')
      .select('*')
      .eq('id', trackingId)
      .eq('owner_user_id', ownerId)
      .maybeSingle();

    if (error) throw error;
    return data as IApplicationTracking | null;
  }

  public async listForUser(ownerId: string): Promise<IApplicationTracking[]> {
    const { data, error } = await supabase
      .from('application_trackings')
      .select('*')
      .eq('owner_user_id', ownerId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data as IApplicationTracking[] || [];
  }

  public async createOrUpdate(data: Partial<IApplicationTracking>): Promise<IApplicationTracking> {
    const existing = await this.getByCompositeKey(
      data.owner_user_id as string,
      data.profile_id as string,
      data.scheme_id as string
    );

    const now = new Date().toISOString();

    if (existing) {
      const updates: any = {};
      if (data.state) updates.state = data.state;
      if (data.evaluation_id) updates.evaluation_id = data.evaluation_id;
      if (data.checklist_state) updates.checklist_state = data.checklist_state;
      if (data.external_reference_optional !== undefined) updates.external_reference_optional = data.external_reference_optional;
      if (data.user_notes_optional !== undefined) updates.user_notes_optional = data.user_notes_optional;
      updates.updated_at = now;
      updates.last_user_update_at = now;

      const { data: updated, error } = await supabase
        .from('application_trackings')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return updated as IApplicationTracking;
    }

    const insertData = {
      ...data,
      created_at: now,
      updated_at: now,
      last_user_update_at: now
    };

    const { data: inserted, error } = await supabase
      .from('application_trackings')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return inserted as IApplicationTracking;
  }
}

export const applicationTrackingRepository = new ApplicationTrackingRepository();
