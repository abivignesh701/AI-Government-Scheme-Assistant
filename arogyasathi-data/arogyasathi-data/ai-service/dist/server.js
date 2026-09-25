"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Basic Security / Service authentication middleware
const internalAuth = (req, res, next) => {
    const key = req.headers['x-internal-key'];
    const expectedKey = process.env.AI_SERVICE_INTERNAL_KEY;
    if (expectedKey && key !== expectedKey) {
        return res.status(403).json({ error: 'Forbidden. Invalid internal service key.' });
    }
    next();
};
app.get('/ai/v1/health', (req, res) => {
    res.json({ status: 'ok', service: 'arogyasathi-ai-service' });
});
const multer_1 = __importDefault(require("multer"));
const controller_1 = require("./app/ocr/controller");
const upload = (0, multer_1.default)({ dest: 'temp/' });
// Mocked AI Routes (To be implemented with real logic when keys are provided)
app.post('/ai/v1/rag/query', internalAuth, (req, res) => {
    if (!process.env.LLM_API_KEY) {
        return res.status(503).json({ error: 'LLM runtime integration: BLOCKED - awaiting API key' });
    }
    res.json({ answer: 'Mocked RAG response' });
});
const orchestrator_1 = require("./app/chatbot/orchestrator");
app.post('/ai/v1/chat', internalAuth, async (req, res) => {
    try {
        const response = await orchestrator_1.chatbotOrchestrator.handleChat(req.body);
        res.json(response);
    }
    catch (err) {
        if (err.message && err.message.includes('BLOCKED')) {
            res.status(503).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'Internal AI Error' });
        }
    }
});
app.post('/ai/v1/ocr/extract', internalAuth, upload.single('file'), async (req, res, next) => {
    try {
        await (0, controller_1.extractDocument)(req, res);
    }
    catch (err) {
        next(err);
    }
});
app.post('/ai/v1/speech/transcribe', internalAuth, (req, res) => {
    if (!process.env.STT_PROVIDER) {
        return res.status(503).json({ error: 'STT runtime integration: BLOCKED - awaiting configuration' });
    }
    res.json({ transcript: 'Mocked speech to text result' });
});
if (require.main === module) {
    app.listen(port, () => {
        console.log(`AI Service listening on port ${port}`);
    });
}
exports.default = app;
