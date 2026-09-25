export interface ChatRequest {
  message: string;
  language: string;
  conversation_id: string;
  scheme_id?: string;
  evaluation_context?: any;
}

export interface ChatResponse {
  answer: string;
  citation_ids: string[];
  scheme_ids: string[];
  requires_official_verification: boolean;
  insufficient_evidence: boolean;
}
