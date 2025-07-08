import React from 'react';
import { Send, Plus, MessageSquare, Trash2 } from 'lucide-react';
import { ModelSelector } from './ModelSelector';
import { MessageBubble } from './MessageBubble';
import { useChat } from '../hooks/useChat';

export const ChatInterface: React.FC = () => {
  const {
    sessions,
    currentSession,
    isLoading,
    selectedModel,
    setSelectedModel,
    createNewSession,
    sendMessage,
    selectSession,
    deleteSession
  } = useChat();

  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    let session = currentSession;
    if (!session) {
      session = createNewSession();
    }

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleNewChat = () => {
    createNewSession();
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-center gap-2 px-4 py-3 hover:bg-gray-700 cursor-pointer border-l-2 ${
                currentSession?.id === session.id 
                  ? 'bg-gray-700 border-blue-500' 
                  : 'border-transparent'
              }`}
              onClick={() => selectSession(session)}
            >
              <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{session.title}</div>
                <div className="text-xs text-gray-400">
                  {session.messages.length} messages
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-opacity"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-700 p-4 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">RidChatAi</h1>
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {currentSession?.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🤖</div>
                <h2 className="text-2xl font-semibold mb-2">Start a conversation</h2>
                <p className="text-gray-400">Ask me anything and I'll help you out!</p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {currentSession?.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex gap-4 p-4 bg-gray-800/50">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white mb-1">Assistant</div>
                    <div className="text-gray-400">Thinking...</div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-700 p-4 bg-gray-800">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};