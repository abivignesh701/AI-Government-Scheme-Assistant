import { Request, Response } from 'express';
import { eligibilityService } from './EligibilityService';
import { eligibilityExplanationService } from './EligibilityExplanationService';
import { citizenProfileRepository } from '../repositories/CitizenProfileRepository';

export const getExplanations = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = (req as any).user.userId;
    const profileId = req.params.profile_id as string;

    const profile = await citizenProfileRepository.getById(profileId, ownerId);
    if (!profile) {
      res.status(404).json({ error: { message: 'Profile not found' } });
      return;
    }

    // Evaluate
    const evaluation = await eligibilityService.evaluateProfile(profileId, ownerId);
    
    // Check if result is stale (in a real app, compare profile version)
    const isStale = (profile as any).version && evaluation.profile_version !== (profile as any).version;

    // Explain
    const isCaregiver = profile.subject_type === 'SOMEONE_ELSE';
    const explanations = eligibilityExplanationService.explain(evaluation, isCaregiver);

    // Get alternatives for NOT_MATCHED
    const result = {
      is_stale: isStale,
      explanations: explanations.map(exp => {
        if (exp.status === 'NOT_MATCHED') {
          // Find alternatives (MATCH or NEEDS_MORE_INFO)
          const alternatives = explanations
            .filter(alt => alt.scheme_id !== exp.scheme_id && (alt.status === 'MATCH' || alt.status === 'NEEDS_MORE_INFORMATION'))
            .slice(0, 3)
            .map(alt => ({
              scheme_id: alt.scheme_id,
              scheme_name: alt.scheme_name,
              status: alt.status
            }));
          return { ...exp, alternatives };
        }
        return exp;
      })
    };

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};

export const getSchemeDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const schemeId = req.params.scheme_id as string;
    
    // Mock fetching scheme detail
    const mockSchemeResult = await eligibilityService.evaluateProfile('dummy', 'dummy');
    const scheme = mockSchemeResult.schemes.find(s => s.scheme_id === schemeId);
    
    if (!scheme) {
      res.status(404).json({ error: { message: 'Scheme not found' } });
      return;
    }
    
    const explanation = eligibilityExplanationService.explain({
      evaluation_id: 'mock',
      profile_id: 'mock',
      profile_version: 1,
      rule_version: '1',
      schemes: [scheme]
    }, false)[0];
    
    res.json(explanation);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};
