
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  chart?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'outlined' | 'glass';
  iconVariant?: 'default' | 'circle' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
  chart,
  variant = 'default',
  iconVariant = 'default',
  size = 'md',
}) => {
  // Calculate size classes
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  // Calculate variant classes
  const variantClasses = {
    default: '',
    gradient: 'bg-accent/30',
    outlined: 'border border-border',
    glass: 'glass-panel',
  };

  // Calculate icon variant classes
  const iconVariantClasses = {
    default: '',
    circle: 'rounded-full p-2',
    subtle: 'bg-accent/30 p-2 rounded-md',
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-sm", 
        variantClasses[variant],
        className
      )}
    >
      <CardContent className={cn("relative", sizeClasses[size])}>
        <div className="flex justify-between items-start">
          <div>
            <p className={cn(
              "text-sm font-medium mb-1", 
              "text-muted-foreground"
            )}>
              {title}
            </p>
            <h3 className={cn(
              "text-xl font-medium", 
              size === 'lg' && 'text-2xl'
            )}>
              {value}
            </h3>
            {description && (
              <p className={cn(
                "text-sm mt-1", 
                "text-muted-foreground"
              )}>
                {description}
              </p>
            )}
            
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${
                trend.isPositive 
                  ? 'text-green-600' 
                  : 'text-red-500'
              }`}>
                {trend.isPositive 
                  ? <ArrowUp className="h-3 w-3 mr-1" /> 
                  : <ArrowDown className="h-3 w-3 mr-1" />
                }
                <span className="font-medium">
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="ml-1 text-xs text-muted-foreground">
                  vs previous period
                </span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className={cn(
              iconVariantClasses[iconVariant],
              variant === 'gradient' 
                ? 'text-primary' 
                : 'text-muted-foreground'
            )}>
              {icon}
            </div>
          )}
        </div>
        
        {chart && (
          <div className={cn("mt-3", size === 'sm' ? 'mt-2' : 'mt-4')}>
            {chart}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
