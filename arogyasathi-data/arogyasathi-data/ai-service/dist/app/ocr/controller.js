"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDocument = void 0;
const TesseractProvider_1 = require("./providers/TesseractProvider");
const PDFTextProvider_1 = require("./providers/PDFTextProvider");
const extractor_1 = require("./extractor");
const crypto_1 = __importDefault(require("crypto"));
const tesseract = new TesseractProvider_1.TesseractProvider();
const pdfProvider = new PDFTextProvider_1.PDFTextProvider();
const extractor = new extractor_1.DocumentExtractor();
const extractDocument = async (req, res) => {
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
        }
        else if (tesseract.supports(mimeType)) {
            ocrResult = await tesseract.extractText(file.path, mimeType);
        }
        else {
            Promise.resolve().then(() => __importStar(require('fs'))).then(fs => fs.unlinkSync(file.path));
            res.status(400).json({ error: `Unsupported file type: ${mimeType}` });
            return;
        }
        const documentId = crypto_1.default.randomUUID();
        const structuredData = extractor.process(ocrResult, documentId);
        // AI service does NOT store raw text. We return structured data and throw away text.
        Promise.resolve().then(() => __importStar(require('fs'))).then(fs => fs.unlinkSync(file.path));
        res.json(structuredData);
    }
    catch (error) {
        Promise.resolve().then(() => __importStar(require('fs'))).then(fs => fs.existsSync(file.path) && fs.unlinkSync(file.path));
        console.error('Extraction Error:', error);
        res.status(500).json({ error: 'Failed to extract document' });
    }
};
exports.extractDocument = extractDocument;
