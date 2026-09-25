import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './app/database/connection';
import authRoutes from './app/auth/routes';
import profilesRoutes from './app/api/profilesRoutes';
import documentsRoutes from './app/api/documentsRoutes';
import questionsRoutes from './app/eligibility/questionsRoutes';
import explanationRoutes from './app/eligibility/explanationRoutes';
import guidanceRoutes from './app/eligibility/guidanceRoutes';
import chatRoutes from './app/ai/chatRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profiles', profilesRoutes);
app.use('/api/v1/profiles', documentsRoutes);
app.use('/api/v1/profiles', questionsRoutes);
app.use('/api/v1', explanationRoutes);
app.use('/api/v1', guidanceRoutes);
app.use('/api/v1', chatRoutes);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', service: 'arogyasathi-backend' });
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Backend API listening on port ${port}`);
    setInterval(() => { console.log('Ping') }, 60000);
  });
}).catch(err => {
  console.error("Failed to start server", err);
  process.exit(1);
});

export default app;
