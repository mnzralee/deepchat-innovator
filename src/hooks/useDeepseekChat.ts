
import { useState, useEffect } from 'react';
import { ChatMessage, MessageRole, ModelSettings } from '@/types/chat';
import { getLocalStorage, setLocalStorage } from '@/lib/localStorage';
import { toast } from 'sonner';

// Default model settings
const DEFAULT_SETTINGS: ModelSettings = {
  model: 'deepseek-chat',
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
      
      const requestBody = {
        model: settings.model,
        messages: apiMessages,
        temperature: settings.temperature,
        max_tokens: settings.max_tokens,
        top_p: settings.top_p,
        frequency_penalty: settings.frequency_penalty,
        presence_penalty: settings.presence_penalty,
      };
      
      console.log('Sending request to DeepSeek API with:', {
        model: settings.model,
        messagesCount: apiMessages.length,
        temperature: settings.temperature,
        apiKeyPresent: !!apiKey,
      });
      
      // Make the actual API call to DeepSeek
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('DeepSeek API error details:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          requestModel: settings.model
        });
        
        // Custom error messages based on status code
        if (response.status === 401) {
          throw new Error('API key is invalid or has expired. Please check your API key.');
        } else if (response.status === 404) {
          throw new Error(`Model "${settings.model}" not found or API endpoint incorrect. Please check your settings or API documentation.`);
        } else if (response.status === 402) {
          throw new Error('Payment required. Your account may need billing information or additional credits.');
        } else {
          throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      const assistantResponse = data.choices[0]?.message?.content || "No response from API";
      
      // Update the assistant's message with the actual API response
      setMessages(currentMessages => {
        const newMessages = [...currentMessages];
        newMessages[newMessages.length - 1].content = assistantResponse;
        return newMessages;
      });
      
      // Show success toast
      toast.success('Response received from DeepSeek');
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the assistant placeholder message if there's an error
      setMessages(updatedMessages);
      
      // Show error toast
      toast.error(error instanceof Error ? error.message : 'Failed to get response from DeepSeek');
      
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
