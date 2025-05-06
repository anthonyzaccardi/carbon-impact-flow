
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import WidgetHeader from '../WidgetHeader';
import ProgressIndicator from "@/components/charts/ProgressIndicator";
import { Target } from '@/types';

interface TargetsWidgetProps {
  targets: Target[];
  resizeWidget: (id: string, newSize: string) => void;
}

const TargetsWidget: React.FC<TargetsWidgetProps> = ({ targets, resizeWidget }) => {
  // Calculate progress data for the targets
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
      <WidgetHeader title="Set Targets" id="targets" resizeWidget={resizeWidget} />
      <CardContent className="p-4">
        <div className="flex flex-col h-full justify-between">
          <div className="text-2xl font-semibold">{targets.length}</div>
          <div className="text-sm text-muted-foreground">Emission reduction targets</div>
          <div className="mt-2">
            <ProgressIndicator 
              current={targetProgressData.current} 
              target={targetProgressData.target} 
              color="#10B981" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TargetsWidget;
