
import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, Tooltip, XAxis, Cell, YAxis } from 'recharts';
import { cn } from '@/lib/utils';

interface MiniBarChartProps {
  data: Array<{ name: string; value: number }>;
  color?: string;
  height?: number;
  showAxis?: boolean;
  activeIndex?: number;
  className?: string;
  variant?: 'default' | 'gradient';
  interactive?: boolean;
}

const MiniBarChart = ({ 
  data, 
  color = "#10B981", 
  height = 40,
  showAxis = false,
  activeIndex: externalActiveIndex,
  className,
  variant = 'default',
  interactive = true
}: MiniBarChartProps) => {
  const gradientId = `barGradient-${Math.random().toString(36).substring(2, 9)}`;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  
  // Use external activeIndex if provided, otherwise use hoverIndex
  const activeIndex = externalActiveIndex !== undefined ? externalActiveIndex : hoverIndex;
  
  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <BarChart 
        data={data} 
        margin={{ top: 5, right: 5, left: 0, bottom: showAxis ? 15 : 5 }}
        onMouseLeave={() => interactive && setHoverIndex(null)}
      >
        {variant === 'gradient' && (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.8} />
              <stop offset="100%" stopColor={color} stopOpacity={0.3} />
            </linearGradient>
          </defs>
        )}
        
        {showAxis && (
          <>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#888' }}
              height={10}
            />
            <YAxis hide />
          </>
        )}
        
        <Bar 
          dataKey="value"
          fill={variant === 'gradient' ? `url(#${gradientId})` : color}
          radius={[2, 2, 0, 0]}
          animationDuration={800}
          animationEasing="ease-out"
          onMouseEnter={(data, index) => interactive && setHoverIndex(index)}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`}
              fillOpacity={interactive && activeIndex !== null ? (index === activeIndex ? 1 : 0.4) : 1} 
              className={interactive ? "cursor-pointer transition-all duration-200" : ""}
            />
          ))}
        </Bar>
        
        <Tooltip
          cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className={cn(
                  "bg-background border border-border p-2 text-xs rounded shadow-md",
                  "animate-scale-in"
                )}>
                  <p className="font-medium">{payload[0].payload.name}</p>
                  <p className="text-primary">{payload[0].value}</p>
                </div>
              );
            }
            return null;
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MiniBarChart;
