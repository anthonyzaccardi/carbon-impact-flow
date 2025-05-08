
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, BarChart, LineChart, PieChart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

// Mock data types
interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  response?: {
    summary: string;
    chartType: 'bar' | 'line' | 'pie';
    chartData: any[];
    linkText: string;
    linkUrl: string;
  };
}

// Mock data for Sweepy responses
const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Helper function to generate responses based on question patterns
const generateMockResponse = (question: string): ChatMessage['response'] => {
  question = question.toLowerCase();
  
  // Example response for emissions questions
  if (question.includes('emission') || question.includes('produce')) {
    return {
      summary: 'In 2024, your company produced 1,245 tCO₂e, which is 12% less than in 2023.',
      chartType: 'bar',
      chartData: [
        { name: 'Q1 2023', value: 352 },
        { name: 'Q2 2023', value: 321 },
        { name: 'Q3 2023', value: 289 },
        { name: 'Q4 2023', value: 456 },
        { name: 'Q1 2024', value: 334 },
        { name: 'Q2 2024', value: 298 },
        { name: 'Q3 2024', value: 267 },
        { name: 'Q4 2024', value: 346 },
      ],
      linkText: 'View in Measurements',
      linkUrl: '/measurements',
    };
  }
  
  // Example response for target questions
  else if (question.includes('target')) {
    return {
      summary: 'You currently have 14 active targets, with 5 completed and 9 in progress.',
      chartType: 'pie',
      chartData: [
        { name: 'Completed', value: 5 },
        { name: 'In Progress', value: 9 },
        { name: 'Not Started', value: 0 },
      ],
      linkText: 'View Targets',
      linkUrl: '/targets',
    };
  }
  
  // Example response for supplier questions
  else if (question.includes('supplier')) {
    return {
      summary: 'Your top 3 suppliers by emissions are Tech Solutions (456 tCO₂e), Global Logistics (324 tCO₂e), and Acme Industries (198 tCO₂e).',
      chartType: 'bar',
      chartData: [
        { name: 'Tech Solutions', value: 456 },
        { name: 'Global Logistics', value: 324 },
        { name: 'Acme Industries', value: 198 },
        { name: 'Quantum Materials', value: 132 },
        { name: 'EcoPack', value: 87 },
      ],
      linkText: 'View Suppliers',
      linkUrl: '/suppliers',
    };
  }
  
  // Example response for tracking progress
  else if (question.includes('progress') || question.includes('track')) {
    return {
      summary: 'Your emissions reduction is tracking at 9.4% against your annual target of 15%.',
      chartType: 'line',
      chartData: [
        { name: 'Jan', value: 0 },
        { name: 'Feb', value: 1.2 },
        { name: 'Mar', value: 2.5 },
        { name: 'Apr', value: 3.8 },
        { name: 'May', value: 4.6 },
        { name: 'Jun', value: 5.9 },
        { name: 'Jul', value: 6.7 },
        { name: 'Aug', value: 7.8 },
        { name: 'Sep', value: 9.4 },
        { name: 'Oct', target: 10.0 },
        { name: 'Nov', target: 12.5 },
        { name: 'Dec', target: 15.0 },
      ],
      linkText: 'View Tracks',
      linkUrl: '/tracks',
    };
  }
  
  // Fallback response
  return {
    summary: "I'm not sure I understand that question. Could you try rephrasing it or asking about emissions, targets, suppliers, or tracking progress?",
    chartType: 'bar',
    chartData: [],
    linkText: 'Explore Dashboard',
    linkUrl: '/',
  };
};

const AskSweepyPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    // Simulate AI processing time (0.5-1.5s)
    setTimeout(() => {
      const response = generateMockResponse(userMessage.content);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.summary,
        timestamp: new Date(),
        response,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }, Math.random() * 1000 + 500);
  };
  
  // Render appropriate chart based on type
  const renderChart = (chartType: 'bar' | 'line' | 'pie', data: any[]) => {
    if (!data.length) return null;
    
    const config = {
      bar: { color: '#0088FE' },
      line: { color: '#00C49F' },
      pie: { colors: CHART_COLORS },
    };
    
    switch (chartType) {
      case 'bar':
        return (
          <ChartContainer config={config}>
            <RechartsBarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="value" fill={config.bar.color} name="Value" />
            </RechartsBarChart>
          </ChartContainer>
        );
        
      case 'line':
        return (
          <ChartContainer config={config}>
            <RechartsLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={config.line.color} 
                name="Actual"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              {data.some(item => 'target' in item) && (
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#8884d8" 
                  name="Target"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 0 }}
                />
              )}
            </RechartsLineChart>
          </ChartContainer>
        );
        
      case 'pie':
        return (
          <ChartContainer config={config}>
            <RechartsPieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={(entry) => entry.name}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={config.pie.colors[index % config.pie.colors.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </RechartsPieChart>
          </ChartContainer>
        );
        
      default:
        return null;
    }
  };

  return (
    <PageLayout
      title="Ask Sweepy"
      description="Ask questions about your carbon data and get instant insights"
      breadcrumbItems={[{ label: 'Ask Sweepy' }]}
    >
      <div className="flex flex-col h-[calc(100vh-180px)]">
        <div className="flex-1 overflow-y-auto mb-4 pr-2">
          {messages.length === 0 ? (
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
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
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
                            {renderChart(message.response.chartType, message.response.chartData)}
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
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

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
      </div>
    </PageLayout>
  );
};

// Need to import this at the top but defining it here to avoid reference errors
const MessageSquareText = (props: any) => {
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

export default AskSweepyPage;
