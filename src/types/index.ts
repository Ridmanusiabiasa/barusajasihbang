export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokens?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: Date;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  isActive: boolean;
}

export interface TokenUsage {
  date: string;
  tokens: number;
  model: string;
  cost: number;
}

export type ModelType = 'gpt-4o-mini' | 'gpt-4o' | 'gpt-4.1-mini' | 'gpt-4.1-nano' | 'gpt-4.1';