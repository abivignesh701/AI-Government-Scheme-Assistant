import { EligibilityResult, SchemeResult } from './EligibilityService';

export interface GuidanceDocument {
  id: string;
  name: string;
  requirement_level: 'REQUIRED' | 'CONDITIONALLY_REQUIRED' | 'MAY_BE_REQUESTED' | 'NEEDS_OFFICIAL_CONFIRMATION' | 'UNKNOWN';
  relevance: 'RELEVANT' | 'CONDITIONALLY_RELEVANT' | 'NOT_APPLICABLE' | 'UNKNOWN';
  description: string;
  why_needed: string;
}

export interface ApplicationChannel {
  id: string;
  type: 'ONLINE_APPLICATION' | 'BENEFICIARY_SEARCH' | 'CSC' | 'GOVERNMENT_OFFICE' | 'HELPLINE' | 'OFFLINE_PROCESS';
  title: string;
  description: string;
  official_url?: string;
  helpline?: string;
  status: 'VERIFIED' | 'OUTDATED' | 'UNAVAILABLE';
}

export interface ApplicationStep {
  id: string;
  order: number;
  type: 'REVIEW_ELIGIBILITY' | 'PREPARE_DOCUMENT' | 'VERIFY_STATUS' | 'OPEN_OFFICIAL_PORTAL' | 'VISIT_CSC';
  title: string;
  description: string;
}

export interface GuidanceDataDTO {
  scheme_id: string;
  evaluation_id: string;
  status: string;
  documents: GuidanceDocument[];
  channels: ApplicationChannel[];
  steps: ApplicationStep[];
  warnings: string[];
}

const MockApplicationData: Record<string, any> = {
  'scheme_1': {
    documents: [
      { id: 'd1', name: 'Income Certificate', requirement_level: 'REQUIRED', description: 'Proof of annual income', condition: 'ALWAYS', why_needed: 'Required by default' },
      { id: 'd2', name: 'Construction Worker Registration', requirement_level: 'CONDITIONALLY_REQUIRED', description: 'Labour card', condition: 'OCCUPATION_CONSTRUCTION', why_needed: 'Required for construction workers' }
    ],
    channels: [
      { id: 'c1', type: 'ONLINE_APPLICATION', title: 'Official Application Portal', description: 'Apply directly through the state portal.', official_url: 'https://example.gov.in/apply', status: 'VERIFIED' },
      { id: 'c2', type: 'CSC', title: 'Common Service Centre', description: 'Visit your nearest CSC.', status: 'VERIFIED' }
    ]
  },
  'scheme_3': {
    documents: [],
    channels: [
      { id: 'c3', type: 'BENEFICIARY_SEARCH', title: 'Official Beneficiary Search', description: 'Check your name in the database.', official_url: 'https://example.gov.in/search', status: 'VERIFIED' }
    ]
  }
};

export class ApplicationGuidanceService {
  
  public getGuidance(schemeResult: SchemeResult, profile: any, evaluationId: string): GuidanceDataDTO {
    const data = MockApplicationData[schemeResult.scheme_id] || { documents: [], channels: [] };

    let warnings: string[] = [];
    if (schemeResult.status === 'NOT_MATCHED') {
      warnings.push('This scheme does not currently match the information provided. The guidance below is for informational purposes.');
    } else if (schemeResult.status === 'NEEDS_MORE_INFORMATION') {
      if (schemeResult.unknown_conditions.some(c => c.status === 'OFFICIAL_VERIFICATION_REQUIRED')) {
        warnings.push('Official verification is still required before you can be fully confident in your eligibility.');
      } else {
        warnings.push('We need more information before we can verify your eligibility. Please answer the remaining questions.');
      }
    }

    // Evaluate documents
    const guidanceDocs: GuidanceDocument[] = data.documents.map((doc: any) => {
      let relevance: 'RELEVANT' | 'CONDITIONALLY_RELEVANT' | 'NOT_APPLICABLE' | 'UNKNOWN' = 'RELEVANT';
      
      if (doc.condition === 'OCCUPATION_CONSTRUCTION') {
        if (profile.occupation === 'CONSTRUCTION_WORKER') relevance = 'RELEVANT';
        else if (profile.occupation) relevance = 'NOT_APPLICABLE';
        else relevance = 'UNKNOWN';
      }

      return {
        id: doc.id,
        name: doc.name,
        requirement_level: doc.requirement_level,
        relevance,
        description: doc.description,
        why_needed: doc.why_needed
      };
    }).filter((d: any) => d.relevance !== 'NOT_APPLICABLE');

    // Steps
    const steps: ApplicationStep[] = [];
    
    if (schemeResult.status === 'MATCH') {
      steps.push({ id: 's1', order: 1, type: 'REVIEW_ELIGIBILITY', title: 'Review matching conditions', description: 'Ensure your information is up to date.' });
      if (guidanceDocs.length > 0) {
        steps.push({ id: 's2', order: 2, type: 'PREPARE_DOCUMENT', title: 'Prepare verified documents', description: 'Gather the required documents.' });
      }
      if (data.channels.some((c: any) => c.type === 'ONLINE_APPLICATION')) {
        steps.push({ id: 's3', order: 3, type: 'OPEN_OFFICIAL_PORTAL', title: 'Use the official application channel', description: 'Follow the government portal instructions.' });
      }
    } else if (schemeResult.status === 'NEEDS_MORE_INFORMATION' && schemeResult.unknown_conditions.some(c => c.status === 'OFFICIAL_VERIFICATION_REQUIRED')) {
      steps.push({ id: 'v1', order: 1, type: 'VERIFY_STATUS', title: 'Complete government verification', description: 'Use the official service to verify your status.' });
    }

    return {
      scheme_id: schemeResult.scheme_id,
      evaluation_id: evaluationId,
      status: schemeResult.status,
      documents: guidanceDocs,
      channels: data.channels,
      steps,
      warnings
    };
  }
}

export const applicationGuidanceService = new ApplicationGuidanceService();
