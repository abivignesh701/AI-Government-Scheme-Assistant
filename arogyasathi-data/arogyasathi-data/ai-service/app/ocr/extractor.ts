import { OCRResult } from './providers/OCRProvider';

export interface ExtractedField {
  field: string;
  value: any;
  display_value: string;
  confidence: number | null;
  needs_confirmation: boolean;
}

export interface StructuredDocument {
  document_id: string;
  document_type: string;
  detected_language: string;
  raw_text_available: boolean;
  fields: ExtractedField[];
  warnings: string[];
  needs_confirmation: boolean;
}

export class DocumentExtractor {
  
  classify(text: string): string {
    const lower = text.toLowerCase();
    if (lower.includes('income certificate') || lower.includes('வருமான சான்றிதழ்') || lower.includes('आय प्रमाण पत्र')) {
      return 'INCOME_CERTIFICATE';
    }
    if (lower.includes('ration card') || lower.includes('குடும்ப அட்டை')) {
      return 'RATION_CARD';
    }
    return 'UNKNOWN_DOCUMENT';
  }

  extractFields(documentType: string, text: string): ExtractedField[] {
    const fields: ExtractedField[] = [];
    const lower = text.toLowerCase();

    if (documentType === 'INCOME_CERTIFICATE') {
      // Mock regex for income extraction (e.g. ₹1,20,000 or Rs. 120000)
      const incomeMatch = text.match(/(?:₹|rs\.?|rupees)\s*([\d,]+)/i);
      if (incomeMatch) {
        const rawValue = incomeMatch[1].replace(/,/g, '');
        fields.push({
          field: 'annual_family_income',
          value: parseInt(rawValue, 10),
          display_value: `₹${parseInt(rawValue, 10).toLocaleString('en-IN')}`,
          confidence: 80,
          needs_confirmation: true
        });
      }

      // Mock state extraction
      if (lower.includes('tamil nadu') || lower.includes('தமிழ்நாடு')) {
        fields.push({
          field: 'state',
          value: 'Tamil Nadu',
          display_value: 'Tamil Nadu',
          confidence: 90,
          needs_confirmation: true
        });
      }
    }

    return fields;
  }

  process(ocrResult: OCRResult, documentId: string): StructuredDocument {
    const type = this.classify(ocrResult.text);
    const fields = this.extractFields(type, ocrResult.text);

    return {
      document_id: documentId,
      document_type: type,
      detected_language: 'en', // default for mock
      raw_text_available: true,
      fields,
      warnings: type === 'UNKNOWN_DOCUMENT' ? ['Could not confidently identify document type.'] : [],
      needs_confirmation: true
    };
  }
}
