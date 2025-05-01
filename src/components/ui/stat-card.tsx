
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
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Calculate variant classes
  const variantClasses = {
    default: '',
    gradient: 'bg-gradient-eco text-white',
    outlined: 'border-2 border-primary/20',
    glass: 'glass-panel',
  };

  // Calculate icon variant classes
  const iconVariantClasses = {
    default: '',
    circle: 'rounded-full p-3',
    subtle: 'bg-primary/10 p-2 rounded-md',
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-card-hover", 
        variantClasses[variant],
        className
      )}
    >
      <CardContent className={cn("relative", sizeClasses[size])}>
        <div className="flex justify-between items-start">
          <div>
            <p className={cn(
              "text-sm font-medium mb-1", 
              variant === 'gradient' ? 'text-white/80' : 'text-muted-foreground'
            )}>
              {title}
            </p>
            <h3 className={cn(
              "text-2xl font-semibold", 
              size === 'lg' && 'text-3xl'
            )}>
              {value}
            </h3>
            {description && (
              <p className={cn(
                "text-sm mt-1", 
                variant === 'gradient' ? 'text-white/70' : 'text-muted-foreground'
              )}>
                {description}
              </p>
            )}
            
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${
                trend.isPositive 
                  ? 'text-eco-green' 
                  : 'text-red-500'
              }`}>
                {trend.isPositive 
                  ? <ArrowUp className="h-4 w-4 mr-1" /> 
                  : <ArrowDown className="h-4 w-4 mr-1" />
                }
                <span className="font-medium">
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className={cn(
                  "ml-1 text-xs", 
                  variant === 'gradient' 
                    ? 'text-white/60' 
                    : 'text-muted-foreground'
                )}>
                  vs previous period
                </span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className={cn(
              iconVariantClasses[iconVariant],
              variant === 'gradient' 
                ? 'bg-white/20 text-white' 
                : 'text-primary'
            )}>
              {icon}
            </div>
          )}
        </div>
        
        {chart && (
          <div className={cn("mt-4", size === 'sm' ? 'mt-2' : 'mt-4')}>
            {chart}
          </div>
        )}

        {variant === 'gradient' && (
          <div 
            className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-white/10 -mr-8 -mb-8"
            aria-hidden="true"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
