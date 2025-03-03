
import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading = false }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-5 w-5 text-primary" />
        </div>
      )}
      
      <div 
        className={`relative max-w-[80%] rounded-lg p-3 ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted/50 text-foreground'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-current opacity-75 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-current opacity-75 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-current opacity-75 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">
            {message.content.split('```').map((part, index) => {
              // Even indices are regular text, odd indices are code blocks
              if (index % 2 === 0) {
                return <span key={index}>{part}</span>;
              } else {
                // Extract language if specified
                const codeLines = part.split('\n');
                const language = codeLines[0].trim();
                const code = codeLines.slice(1).join('\n');
                
                return (
                  <pre key={index} className="mt-2 mb-2 p-3 bg-black/80 text-white rounded overflow-x-auto">
                    {language && <div className="text-xs text-gray-400 mb-1">{language}</div>}
                    <code>{code}</code>
                  </pre>
                );
              }
            })}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
