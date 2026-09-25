import { OCRProvider, OCRResult } from './OCRProvider';
import fs from 'fs';
const pdf = require('pdf-parse');

export class PDFTextProvider implements OCRProvider {
  supports(mimeType: string): boolean {
    return mimeType === 'application/pdf';
  }

  async health(): Promise<boolean> {
    return true;
  }

  async extractText(filePath: string, mimeType: string): Promise<OCRResult> {
    if (!this.supports(mimeType)) {
      throw new Error(`Unsupported MIME type: ${mimeType}`);
    }

    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      return {
        text: data.text,
        confidence: 100 // PDF text extraction is deterministic
      };
    } catch (error) {
      console.error('PDF Parse Error:', error);
      throw new Error('PDF extraction failed');
    }
  }
}
