
import { Target } from "@/types";
import { LinkedTargetItem } from "./LinkedTargetItem";

interface LinkedTargetsListProps {
  targets: Target[];
  supplierId?: string;
  isViewMode: boolean;
  pendingTargetIds: string[];
  onDetachTarget: (id: string) => void;
  isPending: (id: string) => boolean;
}

export const LinkedTargetsList = ({
  targets,
  supplierId,
  isViewMode,
  pendingTargetIds,
  onDetachTarget,
  isPending
}: LinkedTargetsListProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Linked Targets</h3>
      <div className="space-y-2">
        {targets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No targets linked to this supplier</p>
        ) : (
          targets.map((target) => (
            <LinkedTargetItem
              key={target.id}
              target={target}
              isPending={isPending(target.id)}
              isViewMode={isViewMode}
              onDetach={onDetachTarget}
            />
          ))
        )}
      </div>
    </div>
  );
};
