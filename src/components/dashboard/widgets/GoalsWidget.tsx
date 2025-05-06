
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import WidgetHeader from '../WidgetHeader';
import MiniDonutChart from "@/components/charts/MiniDonutChart";
import { Target } from '@/types';

interface GoalsWidgetProps {
  targets: Target[];
  resizeWidget: (id: string, newSize: string) => void;
}

const GoalsWidget: React.FC<GoalsWidgetProps> = ({ targets, resizeWidget }) => {
  const targetProgressData = {
    current: targets.reduce((sum, target) => {
      // Calculate the absolute reduction amount
      const reductionAmount = target.baselineValue * Math.abs(target.targetPercentage) / 100;
      return sum + reductionAmount;
    }, 0),
    target: targets.reduce((sum, target) => sum + (target.baselineValue * 0.3), 0) // Assuming 30% reduction goal
  };

  return (
    <Card className="h-full border shadow-sm">
      <WidgetHeader title="Reduction Goals" id="goals" resizeWidget={resizeWidget} />
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          <div className="flex-1 flex items-center justify-center">
            <MiniDonutChart
              data={[
                { name: 'Achieved', value: targetProgressData.current },
                { name: 'Remaining', value: Math.max(0, targetProgressData.target - targetProgressData.current) }
              ]}
              colors={["#10B981", "#D1D5DB"]}
              height={180}
            />
          </div>
          <div className="mt-2 text-center">
            <p className="text-lg font-semibold">
              {targetProgressData.target > 0 
                ? ((targetProgressData.current / targetProgressData.target) * 100).toFixed(1) 
                : "0"}%
            </p>
            <p className="text-sm text-muted-foreground">
              Of reduction goals complete
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsWidget;
