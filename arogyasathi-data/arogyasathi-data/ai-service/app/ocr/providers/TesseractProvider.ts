import { OCRProvider, OCRResult } from './OCRProvider';
import Tesseract from 'tesseract.js';

export class TesseractProvider implements OCRProvider {
  supports(mimeType: string): boolean {
    return ['image/jpeg', 'image/png', 'image/webp'].includes(mimeType);
  }

  async health(): Promise<boolean> {
    return true; // Local tesseract is always available if memory permits
  }

  async extractText(filePath: string, mimeType: string, lang = 'eng+tam+hin'): Promise<OCRResult> {
    if (!this.supports(mimeType)) {
      throw new Error(`Unsupported MIME type: ${mimeType}`);
    }

    try {
      const result = await Tesseract.recognize(filePath, lang, {
        logger: m => console.log(m)
      });
      return {
        text: result.data.text,
        confidence: result.data.confidence
      };
    } catch (error) {
      console.error('Tesseract Error:', error);
      throw new Error('OCR failed');
    }
  }
}
