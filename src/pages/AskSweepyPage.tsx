import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAppContext } from '@/contexts/useAppContext';
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
} from 'recharts';
import { processQuery, SweepyResponse } from '@/services/sweepy/sweepyService';

// Chat message type
interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  response?: SweepyResponse;
}

// Chart colors
const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AskSweepyPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get application data from context
  const { 
    tracks, 
    factors, 
    measurements, 
    targets, 
    initiatives, 
    suppliers 
  } = useAppContext();

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
  
  // Render appropriate chart based on type
  const renderChart = (chartType: 'bar' | 'line' | 'pie', data: any[]) => {
    if (!data.length) return null;
    
    const config = {
      bar: { color: '#0088FE' },
      line: { color: '#00C49F' },
      pie: { color: '#FFBB28' }, 
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
                fill={config.pie.color}
                label={(entry) => entry.name}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
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

// MessageSquareText icon component
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
