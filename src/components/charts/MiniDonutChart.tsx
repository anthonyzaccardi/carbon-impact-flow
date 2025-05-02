
import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface MiniDonutChartProps {
  data: Array<{ name: string; value: number }>;
  colors?: string[];
  height?: number;
  showLegend?: boolean;
  interactive?: boolean;
}

const MiniDonutChart = ({ 
  data = [], 
  colors = ["#8B5CF6", "#1EAEDB", "#9b87f5", "#7E69AB"], 
  height = 80,
  showLegend = false,
  interactive = true
}: MiniDonutChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

  const onPieEnter = interactive ? (_, index) => {
    setActiveIndex(index);
  } : undefined;
  
  const onPieLeave = interactive ? () => {
    setActiveIndex(null);
  } : undefined;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={15}
          outerRadius={30}
          paddingAngle={2}
          dataKey="value"
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
          animationDuration={800}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]} 
              opacity={interactive && activeIndex !== null ? (index === activeIndex ? 1 : 0.5) : 1}
              className={interactive ? "cursor-pointer transition-all duration-200" : ""}
            />
          ))}
        </Pie>
        
        {showLegend && (
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            formatter={(value) => <span className="text-xs">{value}</span>}
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
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MiniDonutChart;
