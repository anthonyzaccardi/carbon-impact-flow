
import { Target } from "@/types";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, isValid, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface TargetSelectorProps {
  targets: Target[];
  selectedTargets: string[];
  onSelect: (targetId: string) => void;
  disabled?: boolean;
}

export const TargetSelector = ({ targets, selectedTargets, onSelect, disabled }: TargetSelectorProps) => {
  if (targets.length === 0) {
    return <p className="text-sm text-muted-foreground">No targets available</p>;
  }

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid date';
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-2">
      {targets.map((target) => {
        const isSelected = selectedTargets.includes(target.id);
        return (
          <div 
            key={target.id}
            className={cn(
              "flex items-center justify-between p-2 rounded-md",
              isSelected ? "bg-primary/10" : "hover:bg-muted cursor-pointer",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !disabled && onSelect(target.id)}
          >
            <div className="flex items-center space-x-2">
              {isSelected && <Check className="h-4 w-4 text-primary" />}
              <span className="text-sm font-medium">{target.name}</span>
              <Badge variant="outline" className="text-xs">
                {target.targetPercentage}% reduction
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              By {formatDate(target.targetDate)}
            </span>
          </div>
        );
      })}
    </div>
  );
};
