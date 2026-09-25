import { Request, Response } from 'express';
import { TesseractProvider } from './providers/TesseractProvider';
import { PDFTextProvider } from './providers/PDFTextProvider';
import { DocumentExtractor } from './extractor';
import crypto from 'crypto';

const tesseract = new TesseractProvider();
const pdfProvider = new PDFTextProvider();
const extractor = new DocumentExtractor();

export const extractDocument = async (req: Request, res: Response): Promise<void> => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: 'No file provided' });
    return;
  }

  try {
    const mimeType = file.mimetype;
    let ocrResult;

    if (pdfProvider.supports(mimeType)) {
      ocrResult = await pdfProvider.extractText(file.path, mimeType);
    } else if (tesseract.supports(mimeType)) {
      ocrResult = await tesseract.extractText(file.path, mimeType);
    } else {
      import('fs').then(fs => fs.unlinkSync(file.path));
      res.status(400).json({ error: `Unsupported file type: ${mimeType}` });
      return;
    }

    const documentId = crypto.randomUUID();
    const structuredData = extractor.process(ocrResult, documentId);

    // AI service does NOT store raw text. We return structured data and throw away text.
    import('fs').then(fs => fs.unlinkSync(file.path));
    res.json(structuredData);
  } catch (error: any) {
    import('fs').then(fs => fs.existsSync(file.path) && fs.unlinkSync(file.path));
    console.error('Extraction Error:', error);
    res.status(500).json({ error: 'Failed to extract document' });
  }
};
