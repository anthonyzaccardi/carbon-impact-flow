
import { Initiative, Target } from '@/types';
import { 
  createInitiativeOperation, 
  updateInitiativeOperation, 
  deleteInitiativeOperation,
  addTargetsToInitiativeOperation,
  removeTargetFromInitiativeOperation
} from '../operations/initiative';

export const useInitiativeCrud = (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  targets: Target[],
  extractPercentage: (plan: string) => number
) => {
  const createInitiative = async (initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt' | 'absolute' | 'targetIds'> & { targetIds?: string[] }) => {
    return createInitiativeOperation(initiatives, setInitiatives, targets, extractPercentage, initiative);
  };

  const updateInitiative = async (id: string, initiative: Partial<Initiative>) => {
    return updateInitiativeOperation(initiatives, setInitiatives, targets, extractPercentage, id, initiative);
  };

  const deleteInitiative = async (id: string) => {
    return deleteInitiativeOperation(initiatives, setInitiatives, id);
  };

  const addTargetsToInitiative = async (initiativeId: string, targetIds: string[]) => {
    return addTargetsToInitiativeOperation(initiatives, setInitiatives, initiativeId, targetIds);
  };

  const removeTargetFromInitiative = async (initiativeId: string, targetId: string) => {
    return removeTargetFromInitiativeOperation(initiatives, setInitiatives, initiativeId, targetId);
  };

  return {
    createInitiative,
    updateInitiative,
    deleteInitiative,
    addTargetsToInitiative,
    removeTargetFromInitiative
  };
};
