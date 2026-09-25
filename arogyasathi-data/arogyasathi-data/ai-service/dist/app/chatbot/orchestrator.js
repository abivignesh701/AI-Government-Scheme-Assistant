"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatbotOrchestrator = exports.ChatbotOrchestrator = void 0;
const provider_1 = require("../llm/provider");
const provider_2 = require("../embeddings/provider");
const provider_3 = require("../vectorstore/provider");
class ChatbotOrchestrator {
    async getRetrievalContext(query, schemeId) {
        const queryVector = await provider_2.embeddingService.embedQuery(query);
        const filter = schemeId ? { scheme_id: schemeId } : undefined;
        const results = await provider_3.vectorStore.search(queryVector, 5, filter);
        return results;
    }
    buildSystemPrompt(chunks, evaluationContext, language) {
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
    async handleChat(req) {
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
        const messages = [
            { role: 'system', content: this.buildSystemPrompt(chunks, req.evaluation_context, req.language) },
            { role: 'user', content: req.message }
        ];
        try {
            const llmRes = await provider_1.llmService.generate(messages);
            // Parse LLM JSON output (robustly)
            let parsed;
            try {
                parsed = JSON.parse(llmRes.content);
            }
            catch (e) {
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
        }
        catch (e) {
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
exports.ChatbotOrchestrator = ChatbotOrchestrator;
exports.chatbotOrchestrator = new ChatbotOrchestrator();
