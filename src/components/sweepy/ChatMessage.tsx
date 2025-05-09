
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChatMessage as ChatMessageType } from '@/services/sweepy/types/chat';
import SweepyChart from './SweepyChart';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      key={message.id}
      className={`${
        message.type === 'user' ? 'items-end' : 'items-start'
      } flex flex-col`}
    >
      <div
        className={`rounded-lg px-4 py-3 max-w-3xl ${
          message.type === 'user'
            ? 'bg-black text-white self-end'
            : 'bg-accent self-start'
        }`}
      >
        <p>{message.content}</p>
      </div>
      
      {message.type === 'ai' && message.response && (
        <div className="mt-4 w-full space-y-4">
          <Card className="p-4 bg-background border border-border">
            {message.response.chartData.length > 0 && (
              <div className="h-64 mb-4">
                <SweepyChart 
                  chartType={message.response.chartType} 
                  data={message.response.chartData} 
                />
              </div>
            )}
            <div className="flex justify-end">
              <Link to={message.response.linkUrl}>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  {message.response.linkText} <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
