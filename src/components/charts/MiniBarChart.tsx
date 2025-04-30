
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, Tooltip } from 'recharts';

interface MiniBarChartProps {
  data: Array<{ name: string; value: number }>;
  color?: string;
  height?: number;
}

const MiniBarChart = ({ data, color = "#8B5CF6", height = 40 }: MiniBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
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
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MiniBarChart;
