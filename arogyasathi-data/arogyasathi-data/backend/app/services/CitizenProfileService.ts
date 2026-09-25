import { citizenProfileRepository } from '../repositories/CitizenProfileRepository';
import { ICitizenProfile, FieldStatus, ProfileStatus } from '../models/CitizenProfile';

export class CitizenProfileService {
  async createDraft(ownerId: string, subjectType: string): Promise<ICitizenProfile> {
    return await citizenProfileRepository.create({
      owner_user_id: ownerId as any,
      subject_type: subjectType as any,
      status: ProfileStatus.DRAFT,
      profile_version: 1
    });
  }

  async updateDraft(id: string, ownerId: string, updates: Partial<ICitizenProfile>): Promise<ICitizenProfile | null> {
    const errors = this.validateCrossFields(updates);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    return await citizenProfileRepository.update(id, ownerId, updates);
  }

  async markReviewed(id: string, ownerId: string): Promise<ICitizenProfile | null> {
    return await citizenProfileRepository.update(id, ownerId, { status: ProfileStatus.REVIEWED });
  }

  private validateCrossFields(updates: Partial<ICitizenProfile>): string[] {
    const errors: string[] = [];

    // Validation: age >= 0
    if (updates.age?.status === FieldStatus.KNOWN && updates.age.value < 0) {
      errors.push('Age cannot be negative');
    }

    // Validation: family_size >= 1
    if (updates.family_size?.status === FieldStatus.KNOWN && updates.family_size.value < 1) {
      errors.push('Family size must be at least 1');
    }

    // Validation: income >= 0
    if (updates.annual_family_income?.status === FieldStatus.KNOWN && updates.annual_family_income.value < 0) {
      errors.push('Income cannot be negative');
    }

    return errors;
  }
}

export const citizenProfileService = new CitizenProfileService();
