export enum FieldStatus {
  KNOWN = 'KNOWN',
  UNKNOWN = 'UNKNOWN',
  NOT_APPLICABLE = 'NOT_APPLICABLE'
}

export enum SubjectType {
  SELF = 'SELF',
  SOMEONE_ELSE = 'SOMEONE_ELSE'
}

export enum ProfileStatus {
  DRAFT = 'DRAFT',
  REVIEWED = 'REVIEWED',
  READY_FOR_EVALUATION = 'READY_FOR_EVALUATION'
}

export interface IFieldMetadata {
  value: any;
  status: FieldStatus;
  source: 'USER_FORM' | 'VOICE_TRANSCRIPT' | 'OCR' | 'AI_EXTRACTED' | 'USER_CONFIRMED';
  updated_at: Date | string;
}

export interface ICitizenProfile {
  id: string; // was _id from Document
  owner_user_id: string;
  subject_type: SubjectType;
  age?: IFieldMetadata;
  state?: IFieldMetadata;
  district?: IFieldMetadata;
  family_size?: IFieldMetadata;
  annual_family_income?: IFieldMetadata;
  occupation?: IFieldMetadata;
  existing_health_coverage?: IFieldMetadata;
  special_categories?: IFieldMetadata;
  status: ProfileStatus;
  profile_version: number;
  created_at: Date | string;
  updated_at: Date | string;
}

// Stub for backward compatibility in imports
export const CitizenProfile = {
  // We remove findOne etc as it's now handled by the repository using supabase.
};
