
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
      <div className="h-1 bg-gradient-purple"></div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="animate-slide-in-bottom opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.1s' }}>
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
            <div className="bg-eco-purple/10 p-2 rounded-md text-eco-purple animate-slide-in-bottom opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
