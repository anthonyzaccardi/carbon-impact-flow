
import React from 'react';
import { ChevronRight } from 'lucide-react';

// MessageSquareText icon component
export const MessageSquareText = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
      <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
      <path d="M9 9h.01" />
    </svg>
  );
};

const WelcomeScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="mb-6 bg-black text-white p-2 rounded-full">
        <MessageSquareText size={24} />
      </div>
      <h2 className="text-xl font-semibold mb-2">Welcome to Sweepy!</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Ask me questions about your carbon data, and I'll provide insights with visualizations.
      </p>
      <div className="max-w-md text-left space-y-2">
        <p className="text-sm font-medium">Try questions like:</p>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-center">
            <ChevronRight size={14} className="mr-2 text-black" />
            "How much emissions did we produce in 2024?"
          </li>
          <li className="flex items-center">
            <ChevronRight size={14} className="mr-2 text-black" /> 
            "How many targets do I have overall?"
          </li>
          <li className="flex items-center">
            <ChevronRight size={14} className="mr-2 text-black" />
            "What are the top 3 suppliers in terms of emissions?"
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WelcomeScreen;
