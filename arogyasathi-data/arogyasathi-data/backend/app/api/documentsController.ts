import { Request, Response } from 'express';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { citizenProfileRepository } from '../repositories/CitizenProfileRepository';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:4001';
const AI_SERVICE_INTERNAL_KEY = process.env.AI_SERVICE_INTERNAL_KEY || 'development-internal-key';

export const uploadDocument = async (req: Request, res: Response): Promise<void> => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: { message: 'No file uploaded' } });
    return;
  }

  try {
    const ownerId = (req as any).user.userId;
    const profileId = req.params.profile_id as string;
    
    // Check ownership
    const profile = await citizenProfileRepository.getById(profileId, ownerId);
    if (!profile) {
      fs.unlinkSync(file.path);
      res.status(404).json({ error: { message: 'Profile not found or access denied' } });
      return;
    }

    // Prepare forward to AI service
    const form = new FormData();
    form.append('file', fs.createReadStream(file.path));

    const response = await fetch(`${AI_SERVICE_URL}/ai/v1/ocr/extract`, {
      method: 'POST',
      headers: {
        'x-internal-key': AI_SERVICE_INTERNAL_KEY,
        ...form.getHeaders()
      },
      body: form as any
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Service Error:', errorText);
      throw new Error(`AI Service failed to process document: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Clean up local temp file
    fs.unlinkSync(file.path);

    res.status(200).json(data);
  } catch (error: any) {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    console.error('Document Upload Error:', error);
    res.status(500).json({ error: { message: 'Failed to process document', details: error.message } });
  }
};
