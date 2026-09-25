export type ApplicationTrackingState = 
  | 'NOT_STARTED'
  | 'PREPARING_DOCUMENTS'
  | 'REFERRED_TO_OFFICIAL_PORTAL'
  | 'USER_MARKED_SUBMITTED'
  | 'AWAITING_OFFICIAL_UPDATE'
  | 'USER_MARKED_COMPLETED'
  | 'STOPPED'
  | 'UNKNOWN';

export interface IApplicationTracking {
  id: string; // was _id from Document
  owner_user_id: string;
  profile_id: string;
  scheme_id: string;
  evaluation_id: string;
  state: ApplicationTrackingState;
  checklist_state: Record<string, 'HAVE' | 'NEED' | 'NOT_SURE'>;
  external_reference_optional?: string;
  user_notes_optional?: string;
  created_at: Date | string;
  updated_at: Date | string;
  last_user_update_at: Date | string;
}

// Stub for backward compatibility if any imports use it as an object
const ApplicationTracking = {};
export default ApplicationTracking;
