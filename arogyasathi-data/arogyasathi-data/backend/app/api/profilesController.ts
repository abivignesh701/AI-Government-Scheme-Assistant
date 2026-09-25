import { Request, Response } from 'express';
import { citizenProfileService } from '../services/CitizenProfileService';
import { citizenProfileRepository } from '../repositories/CitizenProfileRepository';

export const createProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject_type } = req.body;
    const ownerId = (req as any).user.userId;

    if (!['SELF', 'SOMEONE_ELSE'].includes(subject_type)) {
      res.status(400).json({ error: { message: 'Invalid subject_type' } });
      return;
    }

    const profile = await citizenProfileService.createDraft(ownerId, subject_type);
    res.status(201).json(profile);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = (req as any).user.userId;
    const profileId = req.params.profile_id as string;
    
    const profile = await citizenProfileRepository.getById(profileId, ownerId);
    if (!profile) {
      res.status(404).json({ error: { message: 'Profile not found' } });
      return;
    }
    
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};

export const getCurrentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = (req as any).user.userId;
    const profile = await citizenProfileRepository.getLatestForUser(ownerId);
    if (!profile) {
      res.status(404).json({ error: { message: 'Profile not found' } });
      return;
    }
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = (req as any).user.userId;
    const profileId = req.params.profile_id as string;
    const updates = req.body;

    const profile = await citizenProfileService.updateDraft(profileId, ownerId, updates);
    if (!profile) {
      res.status(404).json({ error: { message: 'Profile not found' } });
      return;
    }
    
    res.json(profile);
  } catch (error: any) {
    if (error.message.startsWith('Validation failed')) {
      res.status(400).json({ error: { message: error.message } });
    } else {
      res.status(500).json({ error: { message: error.message } });
    }
  }
};

export const reviewProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = (req as any).user.userId;
    const profileId = req.params.profile_id as string;

    const profile = await citizenProfileService.markReviewed(profileId, ownerId);
    if (!profile) {
      res.status(404).json({ error: { message: 'Profile not found' } });
      return;
    }

    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};
