
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  trend,
  icon,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-text-secondary font-medium mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold">{value}</p>
              {trend && (
                <div
                  className={`flex items-center text-xs font-medium ${
                    trend.isPositive ? 'text-success' : 'text-error'
                  }`}
                >
                  {trend.isPositive ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(trend.value)}%
                </div>
              )}
            </div>
            {description && (
              <p className="text-xs text-text-tertiary mt-1">{description}</p>
            )}
          </div>
          {icon && (
            <div className="p-2 rounded-full bg-secondary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
