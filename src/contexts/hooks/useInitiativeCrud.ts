
import { Initiative, Target } from '@/types';
import { 
  createInitiativeOperation, 
  updateInitiativeOperation, 
  deleteInitiativeOperation,
  addTargetsToInitiativeOperation,
  removeTargetFromInitiativeOperation
} from '../operations';

export const useInitiativeCrud = (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  targets: Target[],
  extractPercentage: (plan: string) => number
) => {
  const createInitiative = (initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt' | 'absolute' | 'targetIds'> & { targetIds?: string[] }) => {
    createInitiativeOperation(initiatives, setInitiatives, targets, extractPercentage, initiative);
  };

  const updateInitiative = (id: string, initiative: Partial<Initiative>) => {
    updateInitiativeOperation(initiatives, setInitiatives, targets, extractPercentage, id, initiative);
  };

  const deleteInitiative = (id: string) => {
    deleteInitiativeOperation(initiatives, setInitiatives, id);
  };

  const addTargetsToInitiative = (initiativeId: string, targetIds: string[]) => {
    addTargetsToInitiativeOperation(initiatives, setInitiatives, initiativeId, targetIds);
  };

  const removeTargetFromInitiative = (initiativeId: string, targetId: string) => {
    removeTargetFromInitiativeOperation(initiatives, setInitiatives, initiativeId, targetId);
  };

  return {
    createInitiative,
    updateInitiative,
    deleteInitiative,
    addTargetsToInitiative,
    removeTargetFromInitiative
  };
};
