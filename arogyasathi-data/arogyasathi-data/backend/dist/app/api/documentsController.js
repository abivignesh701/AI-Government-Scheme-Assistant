"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocument = void 0;
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const CitizenProfileRepository_1 = require("../repositories/CitizenProfileRepository");
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:4001';
const AI_SERVICE_INTERNAL_KEY = process.env.AI_SERVICE_INTERNAL_KEY || 'development-internal-key';
const uploadDocument = async (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).json({ error: { message: 'No file uploaded' } });
        return;
    }
    try {
        const ownerId = req.user.userId;
        const profileId = req.params.profile_id;
        // Check ownership
        const profile = await CitizenProfileRepository_1.citizenProfileRepository.getById(profileId, ownerId);
        if (!profile) {
            fs_1.default.unlinkSync(file.path);
            res.status(404).json({ error: { message: 'Profile not found or access denied' } });
            return;
        }
        // Prepare forward to AI service
        const form = new form_data_1.default();
        form.append('file', fs_1.default.createReadStream(file.path));
        const response = await fetch(`${AI_SERVICE_URL}/ai/v1/ocr/extract`, {
            method: 'POST',
            headers: {
                'x-internal-key': AI_SERVICE_INTERNAL_KEY,
                ...form.getHeaders()
            },
            body: form
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('AI Service Error:', errorText);
            throw new Error(`AI Service failed to process document: ${response.statusText}`);
        }
        const data = await response.json();
        // Clean up local temp file
        fs_1.default.unlinkSync(file.path);
        res.status(200).json(data);
    }
    catch (error) {
        if (file && fs_1.default.existsSync(file.path)) {
            fs_1.default.unlinkSync(file.path);
        }
        console.error('Document Upload Error:', error);
        res.status(500).json({ error: { message: 'Failed to process document', details: error.message } });
    }
};
exports.uploadDocument = uploadDocument;
