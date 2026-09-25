"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFTextProvider = void 0;
const fs_1 = __importDefault(require("fs"));
const pdf = require('pdf-parse');
class PDFTextProvider {
    supports(mimeType) {
        return mimeType === 'application/pdf';
    }
    async health() {
        return true;
    }
    async extractText(filePath, mimeType) {
        if (!this.supports(mimeType)) {
            throw new Error(`Unsupported MIME type: ${mimeType}`);
        }
        try {
            const dataBuffer = fs_1.default.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return {
                text: data.text,
                confidence: 100 // PDF text extraction is deterministic
            };
        }
        catch (error) {
            console.error('PDF Parse Error:', error);
            throw new Error('PDF extraction failed');
        }
    }
}
exports.PDFTextProvider = PDFTextProvider;
