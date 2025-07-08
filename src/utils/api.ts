import { Message, ModelType } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export class ApiService {
  private static getActiveApiKey(): string {
    const keys = JSON.parse(localStorage.getItem('apiKeys') || '[]');
    const activeKey = keys.find((key: any) => key.isActive);
    return activeKey ? activeKey.key : import.meta.env.VITE_API_KEY;
  }

  static async sendMessage(
    messages: Message[],
    model: ModelType,
    onTokenUsed?: (tokens: number) => void
  ): Promise<string> {
    const apiKey = this.getActiveApiKey();
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 10000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Track token usage
    if (data.usage && onTokenUsed) {
      onTokenUsed(data.usage.total_tokens);
      this.saveTokenUsage(data.usage.total_tokens, model);
    }

    return data.choices[0].message.content;
  }

  private static saveTokenUsage(tokens: number, model: string) {
    const today = new Date().toISOString().split('T')[0];
    const usage = JSON.parse(localStorage.getItem('tokenUsage') || '[]');
    
    const existingEntry = usage.find((entry: any) => 
      entry.date === today && entry.model === model
    );

    if (existingEntry) {
      existingEntry.tokens += tokens;
    } else {
      usage.push({
        date: today,
        tokens,
        model,
        cost: this.calculateCost(tokens, model)
      });
    }

    localStorage.setItem('tokenUsage', JSON.stringify(usage));
  }

  private static calculateCost(tokens: number, model: string): number {
    const rates: Record<string, number> = {
      'gpt-4o-mini': 0.0001,
      'gpt-4o': 0.03,
      'gpt-4.1-mini': 0.0002,
      'gpt-4.1-nano': 0.00005,
      'gpt-4.1': 0.06
    };
    
    return (tokens / 1000) * (rates[model] || 0.0001);
  }
}