
import { useState } from 'react';
import { processQuery } from '@/services/sweepy/sweepyService';
import { ChatMessage } from '@/services/sweepy/types/chat';
import { 
  Track, 
  Factor, 
  Measurement, 
  Target, 
  Initiative, 
  Supplier 
} from '@/types';

export const useSweepyChat = (
  tracks: Track[], 
  factors: Factor[],
  measurements: Measurement[],
  targets: Target[],
  initiatives: Initiative[],
  suppliers: Supplier[]
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setIsProcessing(true);
    
    // Process the query and generate a response
    setTimeout(() => {
      try {
        // Process the query using our service
        const response = processQuery(
          userMessage.content,
          tracks,
          factors,
          measurements,
          targets,
          initiatives,
          suppliers
        );
        
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response.summary,
          timestamp: new Date(),
          response,
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error processing query:', error);
        
        // Fallback response in case of an error
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: "I'm having trouble processing your question. Could you try asking something else?",
          timestamp: new Date(),
          response: {
            summary: "I'm having trouble processing your question. Could you try asking something else?",
            chartType: 'bar',
            chartData: [],
            linkText: 'Explore Dashboard',
            linkUrl: '/',
          },
        };
        
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsProcessing(false);
      }
    }, 500); // Small delay for UX
  };
  
  return {
    messages,
    isProcessing,
    handleSendMessage,
  };
};
