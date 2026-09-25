import { llmService, LLMMessage } from '../llm/provider';
import { embeddingService } from '../embeddings/provider';
import { vectorStore, RAGChunk } from '../vectorstore/provider';
import { redisCache } from '../cache/redisClient';

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

export class ChatbotOrchestrator {
  private async getRetrievalContext(query: string, schemeId?: string): Promise<RAGChunk[]> {
    const queryVector = await embeddingService.embedQuery(query);
    const filter = schemeId ? { scheme_id: schemeId } : undefined;
    const results = await vectorStore.search(queryVector, 5, filter);
    return results;
  }

  private buildSystemPrompt(chunks: RAGChunk[], evaluationContext: any, language: string): string {
    let prompt = `You are ArogyaSathi, a helpful government health benefits assistant.
Respond entirely in the requested language: ${language}.
Use only supplied verified context for government-scheme facts.
Do not invent eligibility rules, benefit amounts, document requirements, URLs, or application steps.
Do not independently decide citizen eligibility.
If evidence is insufficient, say so.
Preserve deterministic eligibility status when provided.
Preserve exact numeric facts.
Preserve official scheme names and URLs when needed.\n\n`;

    if (evaluationContext) {
      prompt += `[EVALUATION CONTEXT]
The citizen's deterministic eligibility result for this scheme is: ${evaluationContext.status}
Do NOT override this status.
[/EVALUATION CONTEXT]\n\n`;
    }

    if (chunks.length > 0) {
      prompt += `[RETRIEVED CONTEXT]\n`;
      chunks.forEach(c => {
        prompt += `<SOURCE id="${c.chunk_id}">\n${c.text}\n</SOURCE>\n\n`;
      });
      prompt += `[/RETRIEVED CONTEXT]\n`;
    }

    return prompt;
  }

  public async handleChat(req: ChatRequest): Promise<ChatResponse> {
    // Basic structured routing / intent check
    const queryLower = req.message.toLowerCase();

    // Check Eligibility Override Attempt
    if (req.evaluation_context && req.evaluation_context.status === 'NOT_MATCHED') {
      if (queryLower.includes('ignore') && queryLower.includes('eligible')) {
        return {
          answer: 'Based on ArogyaSathi\'s current deterministic check, this scheme does not match the information provided. I cannot override this result.',
          citation_ids: [],
          scheme_ids: req.scheme_id ? [req.scheme_id] : [],
          requires_official_verification: false,
          insufficient_evidence: false
        };
      }
    }

    // Retrieve context
    const chunks = await this.getRetrievalContext(req.message, req.scheme_id);

    // Build Messages
    const messages: LLMMessage[] = [
      { role: 'system', content: this.buildSystemPrompt(chunks, req.evaluation_context, req.language) },
      { role: 'user', content: req.message }
    ];

    try {
      const llmRes = await llmService.generate(messages);
      
      // Parse LLM JSON output (robustly)
      let parsed: ChatResponse;
      try {
        parsed = JSON.parse(llmRes.content);
      } catch (e) {
        // Fallback for mock or broken JSON
        parsed = {
          answer: llmRes.content,
          citation_ids: [],
          scheme_ids: [],
          requires_official_verification: false,
          insufficient_evidence: true
        };
      }

      // Citation Validator
      if (parsed.citation_ids && parsed.citation_ids.length > 0) {
        const validIds = chunks.map(c => c.chunk_id);
        parsed.citation_ids = parsed.citation_ids.filter(id => validIds.includes(id));
      }

      return parsed;

    } catch (e: any) {
      if (e.message.includes('BLOCKED')) {
        throw e;
      }
      return {
        answer: 'The AI assistant is temporarily unavailable.',
        citation_ids: [],
        scheme_ids: [],
        requires_official_verification: false,
        insufficient_evidence: true
      };
    }
  }
}

export const chatbotOrchestrator = new ChatbotOrchestrator();
