import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// Basic Security / Service authentication middleware
const internalAuth = (req: Request, res: Response, next: any) => {
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

import multer from 'multer';
import { extractDocument } from './app/ocr/controller';

const upload = multer({ dest: 'temp/' });

// Mocked AI Routes (To be implemented with real logic when keys are provided)
app.post('/ai/v1/rag/query', internalAuth, (req, res) => {
  if (!process.env.LLM_API_KEY) {
    return res.status(503).json({ error: 'LLM runtime integration: BLOCKED - awaiting API key' });
  }
  res.json({ answer: 'Mocked RAG response' });
});

import { chatbotOrchestrator } from './app/chatbot/orchestrator';

app.post('/ai/v1/chat', internalAuth, async (req, res) => {
  try {
    const response = await chatbotOrchestrator.handleChat(req.body);
    res.json(response);
  } catch (err: any) {
    if (err.message && err.message.includes('BLOCKED')) {
      res.status(503).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal AI Error' });
    }
  }
});

app.post('/ai/v1/ocr/extract', internalAuth, upload.single('file'), async (req, res, next) => {
  try {
    await extractDocument(req, res);
  } catch (err) {
    next(err);
  }
});

app.post('/ai/v1/speech/transcribe', internalAuth, (req, res) => {
  if (!process.env.STT_PROVIDER) {
    return res.status(503).json({ error: 'STT runtime integration: BLOCKED - awaiting configuration' });
  }
  res.json({ transcript: 'Mocked speech to text result' });
});

app.listen(port, () => {
  console.log(`AI Service listening on port ${port}`);
  setInterval(() => { console.log('Ping') }, 60000);
});

export default app;
