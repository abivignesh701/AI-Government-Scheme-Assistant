"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiServiceClient = exports.AIServiceClient = void 0;
const axios_1 = __importDefault(require("axios"));
class AIServiceClient {
    baseURL;
    internalKey;
    constructor() {
        this.baseURL = process.env.AI_SERVICE_URL || 'http://localhost:4001';
        this.internalKey = process.env.AI_SERVICE_INTERNAL_KEY || 'default-internal-key';
    }
    async chat(request) {
        try {
            const response = await axios_1.default.post(`${this.baseURL}/ai/v1/chat`, request, { headers: { 'x-internal-key': this.internalKey } });
            return response.data;
        }
        catch (error) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Failed to connect to AI Service');
        }
    }
}
exports.AIServiceClient = AIServiceClient;
exports.aiServiceClient = new AIServiceClient();
