
import { SweepyResponse } from '../types';

// Chat message type
export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  response?: SweepyResponse;
}
