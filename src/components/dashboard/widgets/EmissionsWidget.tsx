
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import WidgetHeader from '../WidgetHeader';
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Track, Measurement } from '@/types';

interface EmissionsWidgetProps {
  tracks: Track[];
  measurements: Measurement[];
  resizeWidget: (id: string, newSize: string) => void;
}

const EmissionsWidget: React.FC<EmissionsWidgetProps> = ({ tracks, measurements, resizeWidget }) => {
  // Generate emissions data for chart
  const emissionsData = [
    { name: 'Jan', value: 5200 },
    { name: 'Feb', value: 4800 },
    { name: 'Mar', value: 6100 },
    { name: 'Apr', value: 5400 },
    { name: 'May', value: 5000 },
    { name: 'Jun', value: 4700 },
    { name: 'Jul', value: 5300 },
    { name: 'Aug', value: 5600 },
    { name: 'Sep', value: 4900 },
    { name: 'Oct', value: 4600 },
    { name: 'Nov', value: 5100 },
    { name: 'Dec', value: 4800 },
  ];
  
  const totalEmissions = tracks.reduce((sum, track) => {
    const trackMeasurements = measurements.filter(m => m.trackId === track.id);
    const trackEmissions = trackMeasurements.reduce((trackSum, measurement) => trackSum + measurement.calculatedValue, 0);
    return sum + trackEmissions;
  }, 0);
  
  const emissionsChange = 5.2; // Example trend

  return (
    <Card className="h-full border shadow-sm">
      <WidgetHeader title="Total Emissions" id="emissions" resizeWidget={resizeWidget} />
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          <div className="flex items-end gap-2 mb-2">
            <span className="text-2xl font-semibold">
              {totalEmissions.toLocaleString(undefined, {
                maximumFractionDigits: 2
              })} tCO₂e
            </span>
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded-full",
              emissionsChange > 0 
                ? "bg-red-100 text-red-700" 
                : "bg-green-100 text-green-700"
            )}>
              {emissionsChange > 0 ? "+" : ""}{emissionsChange}%
            </span>
          </div>
          <div className="text-sm text-muted-foreground mb-4">Carbon dioxide equivalent (Annual)</div>
          <div className="flex-1 w-full h-full min-h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={emissionsData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E5E5' }}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E5E5' }}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`${value} tCO₂e`, 'Emissions']}
                  labelFormatter={(label) => `${label} 2023`}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10B981" 
                  fillOpacity={1} 
                  fill="url(#emissionsGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmissionsWidget;
