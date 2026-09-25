import { Request, Response } from 'express';
import { aiServiceClient } from './AIServiceClient';
import { eligibilityService } from '../eligibility/EligibilityService';
import { citizenProfileRepository } from '../repositories/CitizenProfileRepository';

export const handleChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = (req as any).user.userId;
    const { message, language, scheme_id, conversation_id } = req.body;

    if (!message) {
      res.status(400).json({ error: { message: 'Missing message' } });
      return;
    }

    let evaluationContext = null;
    
    // Auto-resolve evaluation context if scheme is specified
    if (scheme_id) {
      const profile = await citizenProfileRepository.getLatestForUser(ownerId);
      if (profile) {
        const evaluation = await eligibilityService.evaluateProfile(profile.id, ownerId);
        const schemeResult = evaluation.schemes.find(s => s.scheme_id === scheme_id);
        if (schemeResult) {
          evaluationContext = {
            evaluation_id: evaluation.evaluation_id,
            status: schemeResult.status,
            unknown_conditions: schemeResult.unknown_conditions
          };
        }
      }
    }

    const aiRequest = {
      message,
      language: language || 'en',
      conversation_id: conversation_id || 'session-' + Date.now(),
      scheme_id,
      evaluation_context: evaluationContext
    };

    const response = await aiServiceClient.chat(aiRequest);
    res.json(response);

  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};
