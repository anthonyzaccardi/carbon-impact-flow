
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  current: number;
  target: number;
  color?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'slim' | 'gradient';
  className?: string;
}

const ProgressIndicator = ({ 
  current, 
  target, 
  color = "#10B981", 
  showLabels = true,
  size = 'md',
  variant = 'default',
  className
}: ProgressIndicatorProps) => {
  // Calculate percentage of target achieved
  const percentage = Math.min(100, Math.max(0, (current / target) * 100));
  const percentageRounded = Math.round(percentage);

  // Size configuration
  const sizeConfig = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  // Variant configuration
  const variantConfig = {
    default: '',
    slim: 'rounded-full overflow-hidden',
    gradient: `bg-gradient-to-r from-${color}/20 to-${color}/50 overflow-hidden`
  };

  return (
    <div className={cn("w-full space-y-1", className)}>
      <Progress 
        value={percentage} 
        className={cn(
          sizeConfig[size],
          variantConfig[variant],
          "transition-all duration-300"
        )}
        style={{ 
          '--progress-background': color 
        } as React.CSSProperties} 
      />
      {showLabels && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={cn(
            "transition-opacity", 
            percentage > 0 ? "opacity-100" : "opacity-50"
          )}>
            {percentageRounded}%
          </span>
          <span className="font-medium">{current.toLocaleString()} / {target.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
