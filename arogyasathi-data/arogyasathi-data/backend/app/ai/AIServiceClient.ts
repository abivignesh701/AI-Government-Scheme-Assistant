import axios from 'axios';
import { ChatRequest, ChatResponse } from './types';

export class AIServiceClient {
  private baseURL: string;
  private internalKey: string;

  constructor() {
    this.baseURL = process.env.AI_SERVICE_URL || 'http://localhost:4001';
    this.internalKey = process.env.AI_SERVICE_INTERNAL_KEY || 'default-internal-key';
  }

  public async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/ai/v1/chat`,
        request,
        { headers: { 'x-internal-key': this.internalKey } }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to connect to AI Service');
    }
  }
}

export const aiServiceClient = new AIServiceClient();
