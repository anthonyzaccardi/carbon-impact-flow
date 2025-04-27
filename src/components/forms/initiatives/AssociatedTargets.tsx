
import { Target } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format, isValid, parseISO } from "date-fns";

interface AssociatedTargetsProps {
  targets: Target[];
  isViewMode?: boolean;
}

export const AssociatedTargets = ({ targets, isViewMode }: AssociatedTargetsProps) => {
  if (targets.length === 0) return null;

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
    <div>
      <h3 className="text-sm font-medium mb-2">Associated Targets</h3>
      <div className="border rounded-md p-4 space-y-2">
        {targets.map((target) => (
          <div 
            key={target.id}
            className="flex items-center justify-between p-2 rounded-md bg-muted"
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{target.name}</span>
              <Badge variant="outline" className="text-xs">
                {target.targetPercentage}% reduction
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              By {formatDate(target.targetDate)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
