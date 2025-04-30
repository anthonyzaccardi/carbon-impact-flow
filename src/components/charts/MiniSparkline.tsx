
import React from 'react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';

interface MiniSparklineProps {
  data: Array<{ name: string; value: number }>;
  color?: string;
  height?: number;
}

const MiniSparkline = ({ data, color = "#1EAEDB", height = 40 }: MiniSparklineProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={true}
        />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background border border-border p-1 text-xs rounded shadow-sm">
                  <p className="font-medium">{payload[0].payload.name}</p>
                  <p>{payload[0].value}</p>
                </div>
              );
            }
            return null;
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MiniSparkline;
