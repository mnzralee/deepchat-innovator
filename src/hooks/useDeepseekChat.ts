
import { useState, useEffect } from 'react';
import { ChatMessage, MessageRole, ModelSettings } from '@/types/chat';
import { getLocalStorage, setLocalStorage } from '@/lib/localStorage';

// Default model settings
const DEFAULT_SETTINGS: ModelSettings = {
  model: 'deepseek-v3',
  temperature: 0.7,
  max_tokens: 1024,
  top_p: 0.95,
  frequency_penalty: 0,
  presence_penalty: 0,
};

export const useDeepseekChat = (conversationId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ModelSettings>(DEFAULT_SETTINGS);
  
  // Load chat history and settings from localStorage
  useEffect(() => {
    const savedMessages = getLocalStorage<ChatMessage[]>(`messages-${conversationId}`, []);
    const savedSettings = getLocalStorage<ModelSettings>('deepseek-settings', DEFAULT_SETTINGS);
    
    setMessages(savedMessages);
    setSettings(savedSettings);
  }, [conversationId]);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    setLocalStorage(`messages-${conversationId}`, messages);
  }, [messages, conversationId]);
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    setLocalStorage('deepseek-settings', settings);
  }, [settings]);
  
  const updateSettings = (newSettings: Partial<ModelSettings>) => {
    setSettings(current => ({
      ...current,
      ...newSettings,
    }));
  };
  
  const getApiKey = (): string => {
    return localStorage.getItem('deepseek-api-key') || '';
  };
  
  const sendMessage = async (content: string) => {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      throw new Error('API key not found. Please add your DeepSeek API key in settings.');
    }
    
    // Add user message to chat
    const userMessage: ChatMessage = { role: 'user', content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    
    try {
      // Create placeholder for assistant message
      const assistantPlaceholder: ChatMessage = { role: 'assistant', content: '' };
      setMessages([...updatedMessages, assistantPlaceholder]);
      
      // Prepare the API request
      const apiMessages = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      // This would be a real API call in production
      // For now, we simulate the API response with a delay
      // NOTE: Replace this with actual API call when integrating with DeepSeek
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulated response
      const simulatedResponse = `This is a simulated response. In production, this would be a response from the DeepSeek V3 API using the following settings:
      
- Model: ${settings.model}
- Temperature: ${settings.temperature}
- Max Tokens: ${settings.max_tokens}
- Top P: ${settings.top_p}
- Frequency Penalty: ${settings.frequency_penalty}
- Presence Penalty: ${settings.presence_penalty}

To implement the actual API call, replace the simulated response code with a fetch request to the DeepSeek API.`;
      
      // Update the assistant's message with the response
      setMessages(currentMessages => {
        const newMessages = [...currentMessages];
        newMessages[newMessages.length - 1].content = simulatedResponse;
        return newMessages;
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the assistant placeholder message if there's an error
      setMessages(updatedMessages);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearChat = () => {
    setMessages([]);
  };
  
  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    settings,
    updateSettings,
  };
};
