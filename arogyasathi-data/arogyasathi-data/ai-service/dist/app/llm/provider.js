"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.llmService = exports.LLMService = exports.MockLLMProvider = void 0;
class MockLLMProvider {
    async generateResponse(messages) {
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
exports.MockLLMProvider = MockLLMProvider;
class LLMService {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    async generate(messages) {
        return this.provider.generateResponse(messages);
    }
}
exports.LLMService = LLMService;
// Global instance based on config
exports.llmService = new LLMService(new MockLLMProvider());
