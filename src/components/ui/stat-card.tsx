
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-semibold">{value}</h3>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                <span className="font-medium">
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="ml-1 text-xs text-muted-foreground">vs previous period</span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className="bg-primary/10 p-2 rounded-md">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
