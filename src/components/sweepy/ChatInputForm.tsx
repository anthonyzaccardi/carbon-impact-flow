
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputFormProps {
  onSubmit: (message: string) => void;
  isProcessing: boolean;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({ onSubmit, isProcessing }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    onSubmit(inputValue);
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="border-t pt-4">
      <div className="flex gap-2">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question about your carbon data..."
          className="resize-none focus-visible:ring-1 focus-visible:ring-black"
          rows={2}
          disabled={isProcessing}
        />
        <Button 
          type="submit" 
          className="self-end bg-black text-white hover:bg-gray-800" 
          disabled={!inputValue.trim() || isProcessing}
        >
          {isProcessing ? 'Thinking...' : 'Ask'}
        </Button>
      </div>
    </form>
  );
};

export default ChatInputForm;
