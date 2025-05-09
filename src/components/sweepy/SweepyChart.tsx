
import React from 'react';
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Chart colors
const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface SweepyChartProps {
  chartType: 'bar' | 'line' | 'pie';
  data: any[];
}

const SweepyChart: React.FC<SweepyChartProps> = ({ chartType, data }) => {
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

export default SweepyChart;
