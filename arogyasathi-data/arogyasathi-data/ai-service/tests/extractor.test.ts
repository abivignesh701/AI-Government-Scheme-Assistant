import { DocumentExtractor } from '../app/ocr/extractor';

describe('Document Extractor', () => {
  let extractor: DocumentExtractor;

  beforeEach(() => {
    extractor = new DocumentExtractor();
  });

  it('classifies INCOME_CERTIFICATE correctly', () => {
    expect(extractor.classify('This is an Income Certificate')).toBe('INCOME_CERTIFICATE');
    expect(extractor.classify('வருமான சான்றிதழ்')).toBe('INCOME_CERTIFICATE');
  });

  it('classifies UNKNOWN_DOCUMENT correctly', () => {
    expect(extractor.classify('Random text with nothing useful')).toBe('UNKNOWN_DOCUMENT');
  });

  it('extracts income amount from INCOME_CERTIFICATE', () => {
    const fields = extractor.extractFields('INCOME_CERTIFICATE', 'Annual family income is Rs. 150000');
    expect(fields.find(f => f.field === 'annual_family_income')?.value).toBe(150000);
  });

  it('extracts state from INCOME_CERTIFICATE', () => {
    const fields = extractor.extractFields('INCOME_CERTIFICATE', 'Govt of Tamil Nadu');
    expect(fields.find(f => f.field === 'state')?.value).toBe('Tamil Nadu');
  });

  it('extracts nothing if not present', () => {
    const fields = extractor.extractFields('INCOME_CERTIFICATE', 'No income mentioned here');
    expect(fields.length).toBe(0);
  });

  it('returns warnings for unknown documents', () => {
    const result = extractor.process({ text: 'Random text', confidence: 100 }, '123');
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.document_type).toBe('UNKNOWN_DOCUMENT');
  });
});
