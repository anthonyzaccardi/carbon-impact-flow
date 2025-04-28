
import { Target } from "@/types";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, isValid, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/contexts/useAppContext";

interface InitiativeTargetSelectorProps {
  initiativeId: string;
  onClose?: () => void;
}

export const InitiativeTargetSelector = ({ initiativeId, onClose }: InitiativeTargetSelectorProps) => {
  const { targets, initiatives, addTargetsToInitiative } = useAppContext();
  const initiative = initiatives.find(i => i.id === initiativeId);
  
  if (!initiative) return null;

  const handleTargetClick = (targetId: string) => {
    addTargetsToInitiative(initiativeId, [targetId]);
    onClose?.();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid date';
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };

  // Filter out targets that are already attached to this initiative
  const availableTargets = targets.filter(target => !initiative.targetIds.includes(target.id));

  if (availableTargets.length === 0) {
    return <p className="text-sm text-muted-foreground text-center p-4">No available targets to attach</p>;
  }

  return (
    <div className="space-y-2">
      {availableTargets.map((target) => (
        <div 
          key={target.id}
          className={cn(
            "flex items-center justify-between p-4 rounded-md hover:bg-muted cursor-pointer",
            initiative.targetIds.includes(target.id) && "bg-primary/10"
          )}
          onClick={() => handleTargetClick(target.id)}
        >
          <div className="flex items-center space-x-2">
            {initiative.targetIds.includes(target.id) && <Check className="h-4 w-4 text-primary" />}
            <div>
              <h3 className="font-medium">{target.name}</h3>
              <Badge variant="outline" className="mt-1">
                {target.targetPercentage}% reduction
              </Badge>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            By {formatDate(target.targetDate)}
          </span>
        </div>
      ))}
    </div>
  );
};
