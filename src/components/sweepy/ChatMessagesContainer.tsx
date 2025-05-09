
import React, { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '@/services/sweepy/types/chat';
import ChatMessage from './ChatMessage';
import WelcomeScreen from './WelcomeScreen';

interface ChatMessagesContainerProps {
  messages: ChatMessageType[];
}

const ChatMessagesContainer: React.FC<ChatMessagesContainerProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return <WelcomeScreen />;
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessagesContainer;
