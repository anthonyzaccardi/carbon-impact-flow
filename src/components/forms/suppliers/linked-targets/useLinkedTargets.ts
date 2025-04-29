import { useState } from "react";
import { useAppContext } from "@/contexts/useAppContext";
import { Target } from "@/types";
import { toast } from "sonner";

interface UseLinkedTargetsProps {
  supplierId?: string;
  pendingTargetIds: string[];
  setPendingTargetIds: (ids: string[]) => void;
}

export const useLinkedTargets = ({
  supplierId,
  pendingTargetIds,
  setPendingTargetIds
}: UseLinkedTargetsProps) => {
  const { targets: allTargets, updateTarget, tracks } = useAppContext();
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);
  
  // Get linked targets (already linked + pending)
  const linkedTargets = supplierId 
    ? allTargets.filter(t => t.supplierId === supplierId)
    : [];
  
  // Include both currently linked targets and pending targets for display
  const displayTargets = [
    ...linkedTargets,
    ...allTargets.filter(t => pendingTargetIds.includes(t.id) && !linkedTargets.some(lt => lt.id === t.id))
  ];

  // Get targets that are available (not linked to any supplier except current one)
  const availableTargets = allTargets.filter(t => 
    !t.supplierId || (supplierId && t.supplierId === supplierId)
  );

  // Check if a target is already linked to this supplier or pending
  const isLinkedOrPending = (targetId: string) => {
    return displayTargets.some(t => t.id === targetId) || pendingTargetIds.includes(targetId);
  };
  
  // Handle checkbox selection
  const handleSelect = (targetId: string) => {
    setSelectedTargetIds(prev => {
      if (prev.includes(targetId)) {
        return prev.filter(id => id !== targetId);
      } else {
        return [...prev, targetId];
      }
    });
  };

  // Handle saving multiple selected targets
  const handleSaveSelection = () => {
    if (selectedTargetIds.length === 0) return;

    if (supplierId) {
      // If we have a supplierId (edit mode), update targets immediately
      selectedTargetIds.forEach(targetId => {
        const target = allTargets.find(t => t.id === targetId);
        if (target) {
          updateTarget(targetId, { ...target, supplierId });
        }
      });
      toast.success(`${selectedTargetIds.length} target(s) attached to supplier`);
    } else {
      // Otherwise, add to pending targets (create mode)
      const newPendingIds = [...pendingTargetIds];
      
      selectedTargetIds.forEach(id => {
        if (!newPendingIds.includes(id)) {
          newPendingIds.push(id);
        }
      });
      
      setPendingTargetIds(newPendingIds);
      toast.success(`${selectedTargetIds.length} target(s) will be attached after supplier creation`);
    }
    
    setSelectedTargetIds([]);
  };

  // Handle detaching a target
  const handleDetachTarget = (targetId: string) => {
    if (supplierId) {
      // If we have a supplierId (edit mode), update target immediately
      const target = allTargets.find(t => t.id === targetId);
      if (target) {
        updateTarget(targetId, { ...target, supplierId: undefined });
        toast.success("Target detached from supplier");
      }
    } else {
      // Otherwise, remove from pending targets (create mode)
      setPendingTargetIds(pendingTargetIds.filter(id => id !== targetId));
      toast.success("Target removed from selection");
    }
  };

  const isPending = (targetId: string) => !supplierId && pendingTargetIds.includes(targetId);
  
  // Get track name for a target
  const getTrackName = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    return track ? track.name : 'Unknown';
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return {
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
  };
};
