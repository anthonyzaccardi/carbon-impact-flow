
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Initiative, Target } from '@/types';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface InitiativesImpactChartProps {
  initiatives: Initiative[];
  target: Target;
}

export const InitiativesImpactChart: React.FC<InitiativesImpactChartProps> = ({ initiatives, target }) => {
  // Generate random colors for each initiative
  const initiativeColors = useMemo(() => {
    return initiatives.reduce((acc, initiative) => {
      // Generate a random color
      const color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      return { ...acc, [initiative.id]: color };
    }, {});
  }, [initiatives]);

  // Prepare data for the chart
  const chartData = useMemo(() => {
    if (!initiatives.length) return [];

    // Find the earliest start and latest end years
    const years = new Set<number>();
    const initiativesData: Record<string, { 
      id: string,
      name: string, 
      startYear: number, 
      endYear: number,
      baselineValue: number,
      reductionTarget: number,
      color: string
    }> = {};

    initiatives.forEach(initiative => {
      const startDate = new Date(initiative.startDate);
      const endDate = new Date(initiative.endDate);
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      
      // Add all years between start and end to the set
      for (let year = startYear; year <= endYear; year++) {
        years.add(year);
      }

      // Store initiative data
      initiativesData[initiative.id] = {
        id: initiative.id,
        name: initiative.name,
        startYear,
        endYear,
        baselineValue: target.baselineValue,
        reductionTarget: parseFloat(initiative.plan) / 100,
        color: initiativeColors[initiative.id]
      };
    });

    // Sort years in ascending order
    const sortedYears = Array.from(years).sort((a, b) => a - b);
    
    // Create data points for each year
    return sortedYears.map(year => {
      const yearData: Record<string, any> = { year };
      
      // Add a data point for each initiative for this year
      Object.values(initiativesData).forEach(initiative => {
        if (year >= initiative.startYear && year <= initiative.endYear) {
          // Calculate the impact value for this year based on linear interpolation
          const yearProgress = (year - initiative.startYear) / (initiative.endYear - initiative.startYear);
          const impactValue = initiative.baselineValue * (1 - initiative.reductionTarget * yearProgress);
          yearData[initiative.id] = impactValue;
        }
      });
      
      return yearData;
    });
  }, [initiatives, target.baselineValue, initiativeColors]);

  // Get config for ChartContainer
  const chartConfig = useMemo(() => {
    const config: Record<string, any> = {};
    initiatives.forEach(initiative => {
      config[initiative.id] = {
        label: initiative.name,
        color: initiativeColors[initiative.id],
      };
    });
    return config;
  }, [initiatives, initiativeColors]);

  // If no initiatives, show an empty state
  if (!initiatives.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Initiatives Impact Over Time</CardTitle>
          <CardDescription>No initiatives attached yet</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Add initiatives to see their impact over time</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initiatives Impact Over Time</CardTitle>
        <CardDescription>Shows the projected CO2e reduction for each initiative</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer 
          className="h-[300px] w-full" 
          config={chartConfig}
        >
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 10, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value.toLocaleString()} tCO₂e`}
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  labelFormatter={(label) => `Year: ${label}`}
                  formatter={(value, name) => [
                    `${value.toLocaleString()} tCO₂e`,
                    initiatives.find(i => i.id === name)?.name || name
                  ]}
                />
              }
            />
            {initiatives.map((initiative) => (
              <Line
                key={initiative.id}
                type="monotone"
                dataKey={initiative.id}
                stroke={initiativeColors[initiative.id]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <ChartLegend>
          <ChartLegendContent />
        </ChartLegend>
      </CardFooter>
    </Card>
  );
};
