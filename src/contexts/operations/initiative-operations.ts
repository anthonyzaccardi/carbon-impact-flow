
import { toast } from 'sonner';
import { Initiative, Target } from '@/types';
import { generateId, getCurrentTimestamp, calculateInitiativeAbsoluteValue } from '../utils';

export const createInitiativeOperation = (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  targets: Target[],
  extractPercentage: (plan: string) => number,
  initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt' | 'absolute' | 'targetIds'> & { targetIds?: string[] }
) => {
  const absolute = calculateInitiativeAbsoluteValue(
    { ...initiative, targetIds: initiative.targetIds || [] },
    targets,
    extractPercentage
  );

  const newInitiative: Initiative = {
    ...initiative,
    targetIds: initiative.targetIds || [],
    absolute,
    id: generateId('initiative'),
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  };
  setInitiatives([...initiatives, newInitiative]);
  toast.success(`Created initiative: ${initiative.name}`);
};

export const updateInitiativeOperation = (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  targets: Target[],
  extractPercentage: (plan: string) => number,
  id: string,
  initiative: Partial<Initiative>
) => {
  setInitiatives(initiatives.map(i => {
    if (i.id === id) {
      const updatedInitiative = { ...i, ...initiative };
      const absolute = calculateInitiativeAbsoluteValue(
        updatedInitiative,
        targets,
        extractPercentage
      );
      return { ...updatedInitiative, absolute, updatedAt: getCurrentTimestamp() };
    }
    return i;
  }));
  toast.success(`Updated initiative: ${initiative.name || id}`);
};

export const deleteInitiativeOperation = (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  id: string
) => {
  setInitiatives(initiatives.filter(i => i.id !== id));
  toast.success(`Deleted initiative: ${id}`);
};

export const addTargetsToInitiativeOperation = (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  initiativeId: string,
  targetIds: string[]
) => {
  setInitiatives(initiatives.map(i => {
    if (i.id === initiativeId) {
      const newTargetIds = [...new Set([...i.targetIds, ...targetIds])];
      return { ...i, targetIds: newTargetIds, updatedAt: getCurrentTimestamp() };
    }
    return i;
  }));
  toast.success('Added targets to initiative');
};

export const removeTargetFromInitiativeOperation = (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  initiativeId: string,
  targetId: string
) => {
  setInitiatives(initiatives.map(i => {
    if (i.id === initiativeId) {
      return {
        ...i,
        targetIds: i.targetIds.filter(id => id !== targetId),
        updatedAt: getCurrentTimestamp()
      };
    }
    return i;
  }));
  toast.success('Removed target from initiative');
};
