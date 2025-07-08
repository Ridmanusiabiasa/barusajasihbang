import { ChatSession, ApiKey, TokenUsage } from '../types';

export class StorageService {
  static getSessions(): ChatSession[] {
    const sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
    return sessions.map((session: any) => ({
      ...session,
      messages: session.messages?.map((message: any) => ({
        ...message,
        timestamp: new Date(message.timestamp)
      })) || []
    }));
  }

  static saveSession(session: ChatSession) {
    const sessions = this.getSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }
    
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }

  static deleteSession(sessionId: string) {
    const sessions = this.getSessions().filter(s => s.id !== sessionId);
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }

  static getApiKeys(): ApiKey[] {
    const keys = JSON.parse(localStorage.getItem('apiKeys') || '[]');
    return keys.map((key: any) => ({
      ...key,
      createdAt: new Date(key.createdAt)
    }));
  }

  static saveApiKey(apiKey: ApiKey) {
    const keys = this.getApiKeys();
    keys.push(apiKey);
    localStorage.setItem('apiKeys', JSON.stringify(keys));
  }

  static deleteApiKey(keyId: string) {
    const keys = this.getApiKeys().filter(k => k.id !== keyId);
    localStorage.setItem('apiKeys', JSON.stringify(keys));
  }

  static toggleApiKey(keyId: string) {
    const keys = this.getApiKeys();
    keys.forEach(key => {
      key.isActive = key.id === keyId;
    });
    localStorage.setItem('apiKeys', JSON.stringify(keys));
  }

  static getTokenUsage(): TokenUsage[] {
    return JSON.parse(localStorage.getItem('tokenUsage') || '[]');
  }
}