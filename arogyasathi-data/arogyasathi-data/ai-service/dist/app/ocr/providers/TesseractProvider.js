"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TesseractProvider = void 0;
const tesseract_js_1 = __importDefault(require("tesseract.js"));
class TesseractProvider {
    supports(mimeType) {
        return ['image/jpeg', 'image/png', 'image/webp'].includes(mimeType);
    }
    async health() {
        return true; // Local tesseract is always available if memory permits
    }
    async extractText(filePath, mimeType, lang = 'eng+tam+hin') {
        if (!this.supports(mimeType)) {
            throw new Error(`Unsupported MIME type: ${mimeType}`);
        }
        try {
            const result = await tesseract_js_1.default.recognize(filePath, lang, {
                logger: m => console.log(m)
            });
            return {
                text: result.data.text,
                confidence: result.data.confidence
            };
        }
        catch (error) {
            console.error('Tesseract Error:', error);
            throw new Error('OCR failed');
        }
    }
}
exports.TesseractProvider = TesseractProvider;
