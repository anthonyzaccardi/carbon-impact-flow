
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  current: number;
  target: number;
  color?: string;
}

const ProgressIndicator = ({ current, target, color = "#8B5CF6" }: ProgressIndicatorProps) => {
  // Calculate percentage of target achieved
  const percentage = Math.min(100, Math.max(0, (current / target) * 100));

  return (
    <div className="w-full space-y-1">
      <Progress 
        value={percentage} 
        className="h-2" 
        style={{ 
          '--progress-background': color 
        } as React.CSSProperties} 
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{Math.round(percentage)}%</span>
        <span>{current} / {target}</span>
      </div>
    </div>
  );
};

export default ProgressIndicator;
