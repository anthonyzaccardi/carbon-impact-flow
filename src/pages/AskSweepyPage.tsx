
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { useAppContext } from '@/contexts/useAppContext';
import ChatInputForm from '@/components/sweepy/ChatInputForm';
import ChatMessagesContainer from '@/components/sweepy/ChatMessagesContainer';
import { useSweepyChat } from '@/hooks/useSweepyChat';

const AskSweepyPage = () => {
  // Get application data from context
  const { 
    tracks, 
    factors, 
    measurements, 
    targets, 
    initiatives, 
    suppliers 
  } = useAppContext();

  // Use the custom hook for chat functionality
  const { messages, isProcessing, handleSendMessage } = useSweepyChat(
    tracks,
    factors,
    measurements,
    targets,
    initiatives,
    suppliers
  );

  return (
    <PageLayout
      title="Ask Sweepy"
      description="Ask questions about your carbon data and get instant insights"
      breadcrumbItems={[{ label: 'Ask Sweepy' }]}
    >
      <div className="flex flex-col h-[calc(100vh-180px)]">
        <div className="flex-1 overflow-y-auto mb-4 pr-2">
          <ChatMessagesContainer messages={messages} />
        </div>

        <ChatInputForm 
          onSubmit={handleSendMessage}
          isProcessing={isProcessing}
        />
      </div>
    </PageLayout>
  );
};

export default AskSweepyPage;
