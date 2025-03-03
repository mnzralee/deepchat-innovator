import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import ChatMessage from '@/components/chat/ChatMessage';
import ApiKeyForm from '@/components/chat/ApiKeyForm';
import ModelSettings from '@/components/chat/ModelSettings';
import { Cog, Send, Trash2 } from 'lucide-react';
import { useDeepseekChat } from '@/hooks/useDeepseekChat';

const Index = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState(() => `conversation-${Date.now()}`);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    clearChat,
    settings,
    updateSettings
  } = useDeepseekChat(conversationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    try {
      await sendMessage(inputMessage);
      setInputMessage('');
      
      // Focus back on textarea after sending
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  // Handle textarea resize
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleClearChat = () => {
    clearChat();
    toast.success("All messages have been cleared.");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b backdrop-blur-sm bg-white/75 dark:bg-gray-900/75">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">DeepSeek Chat</h1>
          <div className="flex items-center gap-2">
            <ApiKeyForm />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Cog className="h-5 w-5" />
                  <span className="sr-only">Model settings</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <ModelSettings settings={settings} updateSettings={updateSettings} />
              </PopoverContent>
            </Popover>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9" 
              onClick={handleClearChat}
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Clear chat</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-hidden container py-4">
        <Card className="h-full flex flex-col overflow-hidden border">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4 pb-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center text-gray-500">
                  <h2 className="text-xl font-medium mb-2">Welcome to DeepSeek Chat</h2>
                  <p className="max-w-md text-sm">
                    Start a conversation with DeepSeek V3, the advanced language model. Your chat history will be saved locally.
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <ChatMessage 
                    key={index} 
                    message={message} 
                    isLoading={isLoading && index === messages.length - 1} 
                  />
                ))
              )}
            </div>
          </ScrollArea>
          
          <CardContent className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="min-h-10 resize-none"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !inputMessage.trim()}
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
