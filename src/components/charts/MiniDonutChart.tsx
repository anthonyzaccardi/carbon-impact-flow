
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface MiniDonutChartProps {
  data: Array<{ name: string; value: number }>;
  colors?: string[];
  height?: number;
}

const MiniDonutChart = ({ 
  data, 
  colors = ["#8B5CF6", "#1EAEDB", "#9b87f5", "#7E69AB"], 
  height = 80 
}: MiniDonutChartProps) => {
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
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
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
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MiniDonutChart;
