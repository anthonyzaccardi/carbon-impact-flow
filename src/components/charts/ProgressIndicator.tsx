
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
  color = "#000000", 
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
    md: 'h-1.5',
    lg: 'h-2'
  };

  // Variant configuration
  const variantConfig = {
    default: '',
    slim: 'rounded-full overflow-hidden',
    gradient: `bg-accent/30 overflow-hidden`
  };

  return (
    <div className={cn("w-full space-y-1", className)}>
      <Progress 
        value={percentage} 
        className={cn(
          sizeConfig[size],
          variantConfig[variant],
          "transition-all duration-300 bg-secondary"
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
