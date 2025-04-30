
import React from 'react';
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
    <div className={cn("border border-[#EEEEEE] rounded-lg p-5 bg-white", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-[#71717A] mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-[#333336]">{value}</h3>
          {description && <p className="text-[13px] text-[#71717A] mt-1">{description}</p>}
          
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? 'text-[#1FCC83]' : 'text-[#D64141]'}`}>
              <span className="font-medium">
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="ml-1 text-xs text-[#71717A]">—</span>
              <span className="ml-1 text-xs text-[#71717A]">vs previous period</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="text-[#717175]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
