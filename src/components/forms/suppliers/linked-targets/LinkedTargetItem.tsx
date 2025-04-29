
import { Target } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface LinkedTargetItemProps {
  target: Target;
  isPending: boolean;
  isViewMode: boolean;
  onDetach: (id: string) => void;
}

export const LinkedTargetItem = ({ 
  target, 
  isPending, 
  isViewMode, 
  onDetach 
}: LinkedTargetItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md bg-muted/10">
      <div>
        <p className="font-medium">
          {target.name}
          {isPending && (
            <span className="ml-2 text-xs text-muted-foreground">(pending)</span>
          )}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline">{target.targetPercentage}% reduction</Badge>
          <Badge variant="outline">{target.status.replace('_', ' ')}</Badge>
        </div>
      </div>
      {!isViewMode && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDetach(target.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Detach</span>
        </Button>
      )}
    </div>
  );
};
