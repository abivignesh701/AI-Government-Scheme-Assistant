import { Request, Response } from 'express';
import { eligibilityService } from './EligibilityService';
import { smartQuestionService } from './SmartQuestionService';
import { citizenProfileService } from '../services/CitizenProfileService';
import { citizenProfileRepository } from '../repositories/CitizenProfileRepository';

export const getQuestionPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = (req as any).user.userId;
    const profileId = req.params.profile_id as string;

    // Check ownership
    const profile = await citizenProfileRepository.getById(profileId, ownerId);
    if (!profile) {
      res.status(404).json({ error: { message: 'Profile not found' } });
      return;
    }

    const evaluation = await eligibilityService.evaluateProfile(profileId, ownerId);
    const plan = smartQuestionService.generatePlan(evaluation);

    res.json(plan);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};

export const answerQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = (req as any).user.userId;
    const profileId = req.params.profile_id as string;
    const { field, value, status } = req.body;

    const profile = await citizenProfileRepository.getById(profileId, ownerId);
    if (!profile) {
      res.status(404).json({ error: { message: 'Profile not found' } });
      return;
    }

    // Allowed fields for questions
    const allowedFields = ['annual_family_income', 'occupation', 'state', 'district', 'family_size', 'existing_health_coverage'];
    if (!allowedFields.includes(field)) {
      res.status(400).json({ error: { message: 'Invalid or restricted field' } });
      return;
    }

    const updates: any = {
      [field]: {
        value: status === 'UNKNOWN' ? null : value,
        status: status === 'UNKNOWN' ? 'UNKNOWN' : 'KNOWN',
        source: 'USER_CONFIRMED'
      }
    };

    // Update profile
    await citizenProfileService.updateDraft(profileId, ownerId, updates);

    // Re-evaluate
    const newEvaluation = await eligibilityService.evaluateProfile(profileId, ownerId);
    const newPlan = smartQuestionService.generatePlan(newEvaluation);

    // Send back the new plan and evaluation results
    res.json({
      evaluation: newEvaluation,
      plan: newPlan
    });
  } catch (error: any) {
    if (error.message.startsWith('Validation failed')) {
      res.status(400).json({ error: { message: error.message } });
    } else {
      res.status(500).json({ error: { message: error.message } });
    }
  }
};
