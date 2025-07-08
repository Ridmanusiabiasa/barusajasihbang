import { useState, useCallback } from 'react';
import { Message, ChatSession, ModelType } from '../types';
import { ApiService } from '../utils/api';
import { StorageService } from '../utils/storage';

export const useChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => 
    StorageService.getSessions()
  );
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>('gpt-4o-mini');

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      model: selectedModel,
      createdAt: new Date()
    };
    
    setCurrentSession(newSession);
    return newSession;
  }, [selectedModel]);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentSession || isLoading) return;

    setIsLoading(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
      title: currentSession.messages.length === 0 ? 
        content.slice(0, 30) + (content.length > 30 ? '...' : '') : 
        currentSession.title
    };

    setCurrentSession(updatedSession);

    try {
      const response = await ApiService.sendMessage(
        [...currentSession.messages, userMessage],
        selectedModel,
        (tokens) => {
          console.log(`Used ${tokens} tokens`);
        }
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, assistantMessage]
      };

      setCurrentSession(finalSession);
      StorageService.saveSession(finalSession);
      
      setSessions(prev => {
        const filtered = prev.filter(s => s.id !== finalSession.id);
        return [finalSession, ...filtered];
      });

    } catch (error) {
      console.error('Failed to send message:', error);
      // Handle error - could show toast notification
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, selectedModel, isLoading]);

  const selectSession = useCallback((session: ChatSession) => {
    setCurrentSession(session);
    setSelectedModel(session.model as ModelType);
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    StorageService.deleteSession(sessionId);
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  }, [currentSession]);

  return {
    sessions,
    currentSession,
    isLoading,
    selectedModel,
    setSelectedModel,
    createNewSession,
    sendMessage,
    selectSession,
    deleteSession
  };
};