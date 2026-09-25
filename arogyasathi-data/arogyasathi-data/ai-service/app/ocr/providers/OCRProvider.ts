export interface OCRResult {
  text: string;
  confidence: number;
}

export interface OCRProvider {
  extractText(filePath: string, mimeType: string, lang?: string): Promise<OCRResult>;
  supports(mimeType: string): boolean;
  health(): Promise<boolean>;
}
