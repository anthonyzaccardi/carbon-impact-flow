
import { Target } from "@/types";
import { LinkedTargetsList } from "./linked-targets/LinkedTargetsList";
import { TargetSelectionTable } from "./linked-targets/TargetSelectionTable";
import { useLinkedTargets } from "./linked-targets/useLinkedTargets";

interface LinkedTargetsProps {
  targets: Target[];
  supplierId?: string;
  isViewMode: boolean;
  pendingTargetIds?: string[];
  setPendingTargetIds?: (ids: string[]) => void;
}

export const LinkedTargets = ({ 
  targets, 
  supplierId, 
  isViewMode,
  pendingTargetIds = [],
  setPendingTargetIds = () => {}
}: LinkedTargetsProps) => {
  const {
    displayTargets,
    availableTargets,
    selectedTargetIds,
    handleSelect,
    handleSaveSelection,
    handleDetachTarget,
    isPending,
    isLinkedOrPending,
    getTrackName,
    formatDate
  } = useLinkedTargets({
    supplierId,
    pendingTargetIds,
    setPendingTargetIds
  });

  return (
    <div className="space-y-4">
      <LinkedTargetsList
        targets={displayTargets}
        supplierId={supplierId}
        isViewMode={isViewMode}
        pendingTargetIds={pendingTargetIds}
        onDetachTarget={handleDetachTarget}
        isPending={isPending}
      />

      {!isViewMode && availableTargets.length > 0 && (
        <TargetSelectionTable
          availableTargets={availableTargets}
          selectedTargetIds={selectedTargetIds}
          isLinkedOrPending={isLinkedOrPending}
          onSelect={handleSelect}
          onSaveSelection={handleSaveSelection}
          getTrackName={getTrackName}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};
