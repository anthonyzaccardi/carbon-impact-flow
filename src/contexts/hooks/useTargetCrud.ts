
import { Target, Initiative } from '@/types';
import { createTargetOperation, updateTargetOperation, deleteTargetOperation } from '../operations';

export const useTargetCrud = (
  targets: Target[],
  setTargets: (targets: Target[]) => void,
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void
) => {
  const createTarget = (target: Omit<Target, 'id' | 'createdAt' | 'updatedAt' | 'targetValue'>) => {
    createTargetOperation(targets, setTargets, target);
  };

  const updateTarget = (id: string, target: Partial<Target>) => {
    updateTargetOperation(targets, setTargets, id, target);
  };

  const deleteTarget = (id: string) => {
    deleteTargetOperation(targets, setTargets, initiatives, setInitiatives, id);
  };

  return {
    createTarget,
    updateTarget,
    deleteTarget
  };
};
