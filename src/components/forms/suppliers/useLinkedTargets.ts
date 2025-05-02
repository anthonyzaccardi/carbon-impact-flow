
import { useState } from 'react';
import { Target } from '@/types';

interface UseLinkedTargetsProps {
  initialTargets?: Target[];
}

export function useLinkedTargets({ initialTargets = [] }: UseLinkedTargetsProps) {
  const [linkedTargets, setLinkedTargets] = useState<Target[]>(initialTargets);
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>(
    initialTargets.map((target) => target.id)
  );

  const handleLinkTarget = (target: Target) => {
    setLinkedTargets((prev) => [...prev, target]);
    setSelectedTargetIds((prev) => [...prev, target.id]);
  };

  const handleUnlinkTarget = (targetId: string) => {
    setLinkedTargets((prev) => prev.filter((t) => t.id !== targetId));
    setSelectedTargetIds((prev) => prev.filter((id) => id !== targetId));
  };

  const handleSelectTargets = (selectedIds: string[], selectedTargets: Target[]) => {
    setSelectedTargetIds(selectedIds);
    setLinkedTargets(selectedTargets);
  };

  return {
    linkedTargets,
    selectedTargetIds,
    handleLinkTarget,
    handleUnlinkTarget,
    handleSelectTargets,
  };
}
