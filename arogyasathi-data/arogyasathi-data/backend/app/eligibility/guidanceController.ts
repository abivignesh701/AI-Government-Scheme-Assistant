import { Request, Response } from 'express';
import { applicationGuidanceService } from './ApplicationGuidanceService';
import { applicationTrackingService } from './ApplicationTrackingService';
import { eligibilityService } from './EligibilityService';
import { citizenProfileRepository } from '../repositories/CitizenProfileRepository';
import { ApplicationTrackingState } from '../models/ApplicationTracking';

export const getGuidance = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = (req as any).user.userId;
    const schemeId = req.params.scheme_id as string;
    
    // In real app, we need to find the user's active profile and evaluation. 
    // Here we'll mock loading the dummy profile and evaluating it to match Module 6.
    const profile = await citizenProfileRepository.getLatestForUser(ownerId);
    if (!profile) {
      res.status(404).json({ error: { message: 'Profile not found' } });
      return;
    }
    
    const evaluation = await eligibilityService.evaluateProfile(profile.id, ownerId);
    const schemeResult = evaluation.schemes.find(s => s.scheme_id === schemeId);
    
    if (!schemeResult) {
      res.status(404).json({ error: { message: 'Scheme evaluation not found' } });
      return;
    }

    const guidance = applicationGuidanceService.getGuidance(schemeResult, profile, evaluation.evaluation_id);
    
    res.json(guidance);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};

export const startTracking = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = (req as any).user.userId;
    const { profile_id, scheme_id, evaluation_id } = req.body;
    
    if (!profile_id || !scheme_id || !evaluation_id) {
      res.status(400).json({ error: { message: 'Missing required tracking fields' } });
      return;
    }

    const tracking = await applicationTrackingService.startTracking(ownerId, profile_id, scheme_id, evaluation_id);
    res.json(tracking);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};

export const updateTrackingState = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = (req as any).user.userId;
    const trackingId = req.params.tracking_id as string;
    const { state } = req.body;

    if (!state) {
      res.status(400).json({ error: { message: 'Missing state' } });
      return;
    }

    const tracking = await applicationTrackingService.updateState(trackingId, ownerId, state as ApplicationTrackingState);
    res.json(tracking);
  } catch (error: any) {
    if (error.message === 'Invalid tracking state' || error.message === 'Tracking record not found') {
       res.status(400).json({ error: { message: error.message } });
       return;
    }
    res.status(500).json({ error: { message: error.message } });
  }
};

export const listTracking = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = (req as any).user.userId;
    const trackings = await applicationTrackingService.listTracking(ownerId);
    res.json(trackings);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};

export const getTracking = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = (req as any).user.userId;
    const trackingId = req.params.tracking_id as string;
    const tracking = await applicationTrackingService.getTrackingById(trackingId, ownerId);
    
    if (!tracking) {
      res.status(404).json({ error: { message: 'Tracking record not found' } });
      return;
    }
    
    res.json(tracking);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};

export const updateChecklist = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = (req as any).user.userId;
    const trackingId = req.params.tracking_id as string;
    const { doc_id, status } = req.body;
    
    if (!doc_id || !status) {
      res.status(400).json({ error: { message: 'Missing doc_id or status' } });
      return;
    }

    const tracking = await applicationTrackingService.updateChecklist(trackingId, ownerId, doc_id, status);
    res.json(tracking);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};
