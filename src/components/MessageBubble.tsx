import React from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';
import { Message } from '../types';
import { CodeBlock } from './CodeBlock';

interface MessageBubbleProps {
  message: Message;
  isTyping?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isTyping }) => {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === 'user';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className={`flex gap-4 p-4 ${isUser ? 'bg-transparent' : 'bg-gray-800/50'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-600' : 'bg-green-600'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-white">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-gray-400">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="text-gray-100 leading-relaxed">
          <MessageContent content={message.content} />
          {isTyping && (
            <span className="inline-block w-2 h-5 bg-gray-400 ml-1 animate-pulse" />
          )}
        </div>
        
        {!isUser && !isTyping && (
          <button
            onClick={copyToClipboard}
            className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const MessageContent: React.FC<{ content: string }> = ({ content }) => {
  const parts = content.split(/(```[\s\S]*?```)/);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const codeContent = part.slice(3, -3);
          const lines = codeContent.split('\n');
          const language = lines[0].trim();
          const code = lines.slice(1).join('\n');
          
          return (
            <CodeBlock
              key={index}
              code={code}
              language={language || 'text'}
            />
          );
        }
        
        return (
          <span key={index} className="whitespace-pre-wrap">
            {part}
          </span>
        );
      })}
    </>
  );
};