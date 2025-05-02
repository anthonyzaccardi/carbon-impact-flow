
import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis, ReferenceDot } from 'recharts';

interface MiniSparklineProps {
  data: Array<{ name: string; value: number }>;
  color?: string;
  height?: number;
  showAxis?: boolean;
  interactive?: boolean;
  gradient?: boolean;
}

const MiniSparkline = ({ 
  data = [], 
  color = "#1EAEDB", 
  height = 40,
  showAxis = false,
  interactive = true,
  gradient = false
}: MiniSparklineProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const gradientId = `sparkline-gradient-${Math.random().toString(36).substring(2, 9)}`;

  // Safeguard against empty data
  if (!data || data.length === 0) {
    return (
      <div 
        style={{ height: `${height}px` }} 
        className="w-full flex items-center justify-center text-xs text-muted-foreground"
      >
        No data available
      </div>
    );
  }

  const handleMouseMove = interactive ? (props) => {
    if (props && props.activeTooltipIndex !== undefined) {
      setActiveIndex(props.activeTooltipIndex);
    }
  } : undefined;

  const handleMouseLeave = interactive ? () => {
    setActiveIndex(null);
  } : undefined;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart 
        data={data} 
        margin={{ top: 5, right: 5, left: 0, bottom: showAxis ? 15 : 5 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {gradient && (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.2}/>
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
        
        <Line
          type="monotone"
          dataKey="value"
          stroke={gradient ? `url(#${gradientId})` : color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, stroke: color, strokeWidth: 1, fill: 'white' }}
          isAnimationActive={true}
          animationDuration={800}
          animationEasing="ease-out"
        />
        
        {activeIndex !== null && activeIndex >= 0 && activeIndex < data.length && (
          <ReferenceDot 
            x={data[activeIndex].name} 
            y={data[activeIndex].value} 
            r={4} 
            fill="white" 
            stroke={color} 
            strokeWidth={2}
          />
        )}
        
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background border border-border p-2 text-xs rounded shadow-sm animate-scale-in">
                  <p className="font-medium">{payload[0].payload.name}</p>
                  <p>{payload[0].value}</p>
                </div>
              );
            }
            return null;
          }}
          cursor={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MiniSparkline;
