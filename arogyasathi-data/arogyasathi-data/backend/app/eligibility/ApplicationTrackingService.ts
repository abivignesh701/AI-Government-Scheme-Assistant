import { applicationTrackingRepository } from '../repositories/ApplicationTrackingRepository';
import { ApplicationTrackingState, IApplicationTracking } from '../models/ApplicationTracking';

export class ApplicationTrackingService {

  public async getTrackingForScheme(ownerId: string, profileId: string, schemeId: string): Promise<IApplicationTracking | null> {
    return applicationTrackingRepository.getByCompositeKey(ownerId, profileId, schemeId);
  }

  public async listTracking(ownerId: string): Promise<IApplicationTracking[]> {
    return applicationTrackingRepository.listForUser(ownerId);
  }
  
  public async getTrackingById(trackingId: string, ownerId: string): Promise<IApplicationTracking | null> {
    return applicationTrackingRepository.getById(trackingId, ownerId);
  }

  public async startTracking(ownerId: string, profileId: string, schemeId: string, evaluationId: string): Promise<IApplicationTracking> {
    return applicationTrackingRepository.createOrUpdate({
      owner_user_id: ownerId as any,
      profile_id: profileId,
      scheme_id: schemeId,
      evaluation_id: evaluationId,
      state: 'NOT_STARTED',
      checklist_state: {}
    });
  }

  public async updateState(trackingId: string, ownerId: string, newState: ApplicationTrackingState): Promise<IApplicationTracking> {
    const existing = await this.getTrackingById(trackingId, ownerId);
    if (!existing) throw new Error('Tracking record not found');
    
    // Ensure valid state
    const validStates: ApplicationTrackingState[] = [
      'NOT_STARTED', 'PREPARING_DOCUMENTS', 'REFERRED_TO_OFFICIAL_PORTAL',
      'USER_MARKED_SUBMITTED', 'AWAITING_OFFICIAL_UPDATE', 'USER_MARKED_COMPLETED', 'STOPPED'
    ];
    if (!validStates.includes(newState)) {
      throw new Error('Invalid tracking state');
    }

    return applicationTrackingRepository.createOrUpdate({
      owner_user_id: ownerId as any,
      profile_id: existing.profile_id,
      scheme_id: existing.scheme_id,
      state: newState
    });
  }

  public async updateChecklist(trackingId: string, ownerId: string, docId: string, status: 'HAVE' | 'NEED' | 'NOT_SURE'): Promise<IApplicationTracking> {
    const existing = await this.getTrackingById(trackingId, ownerId);
    if (!existing) throw new Error('Tracking record not found');

    const checklist = existing.checklist_state || {};
    
    // Convert Mongoose map to plain object if needed, but Supabase JSONB returns plain object
    if (typeof (checklist as any).get === 'function') {
      const plainObj: any = {};
      (checklist as any).forEach((val: any, key: string) => plainObj[key] = val);
      plainObj[docId] = status;
      existing.checklist_state = plainObj;
    } else {
      (checklist as any)[docId] = status;
    }

    return applicationTrackingRepository.createOrUpdate({
      owner_user_id: ownerId,
      profile_id: existing.profile_id,
      scheme_id: existing.scheme_id,
      checklist_state: checklist as any
    });
  }
}

export const applicationTrackingService = new ApplicationTrackingService();
