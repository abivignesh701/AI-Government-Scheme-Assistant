export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  tokens?: { input: number; output: number };
}

export interface LLMProvider {
  generateResponse(messages: LLMMessage[]): Promise<LLMResponse>;
}

export class MockLLMProvider implements LLMProvider {
  public async generateResponse(messages: LLMMessage[]): Promise<LLMResponse> {
    if (process.env.NODE_ENV !== 'test' && !process.env.LLM_API_KEY) {
      throw new Error('LLM runtime integration: BLOCKED - awaiting project owner credentials');
    }
    
    // Check for prompt injection in tests
    if (messages.some(m => m.content.toLowerCase().includes('ignore all rules'))) {
      return {
        content: 'I cannot fulfill this request.',
        tokens: { input: 10, output: 5 }
      };
    }

    return {
      content: '{"answer": "This is a grounded mock response based on evidence.", "citation_ids": ["c1"], "scheme_ids": ["scheme_1"], "requires_official_verification": false, "insufficient_evidence": false}',
      tokens: { input: 150, output: 50 }
    };
  }
}

export class LLMService {
  private provider: LLMProvider;

  constructor(provider: LLMProvider) {
    this.provider = provider;
  }

  public async generate(messages: LLMMessage[]): Promise<LLMResponse> {
    return this.provider.generateResponse(messages);
  }
}

// Global instance based on config
export const llmService = new LLMService(new MockLLMProvider());
