
import { Target } from "@/types";
import { useAppContext } from "@/contexts/useAppContext";

interface LinkedTargetsProps {
  targets: Target[];
}

export const LinkedTargets = ({ targets }: LinkedTargetsProps) => {
  const { openSidePanel } = useAppContext();

  const viewTarget = (target: Target) => {
    openSidePanel('view', 'target', target);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Linked Targets</h3>
      {targets.length > 0 ? (
        <div className="border rounded-md divide-y">
          {targets.map((target) => (
            <div 
              key={target.id} 
              className="p-3 hover:bg-accent/50 cursor-pointer"
              onClick={() => viewTarget(target)}
            >
              <div className="font-medium">{target.name}</div>
              <div className="text-sm text-muted-foreground">
                {target.targetPercentage}% reduction by {new Date(target.targetDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground">No targets linked to this supplier</div>
      )}
    </div>
  );
};
