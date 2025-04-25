
import { toast } from 'sonner';
import { Target, Initiative } from '@/types';
import { generateId, getCurrentTimestamp } from '../utils';

export const createTargetOperation = (
  targets: Target[],
  setTargets: (targets: Target[]) => void,
  target: Omit<Target, 'id' | 'createdAt' | 'updatedAt' | 'targetValue'>
) => {
  if (!target.trackId) {
    toast.error('Target must be associated with a track');
    return;
  }

  const targetValue = target.baselineValue * (1 - (target.targetPercentage / 100));
  const newTarget: Target = {
    ...target,
    targetValue,
    id: generateId('target'),
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  };
  setTargets([...targets, newTarget]);
  toast.success(`Created target: ${target.name}`);
};

export const updateTargetOperation = (
  targets: Target[],
  setTargets: (targets: Target[]) => void,
  id: string,
  target: Partial<Target>
) => {
  if (target.trackId === undefined) {
    const existingTarget = targets.find(t => t.id === id);
    if (existingTarget) {
      target.trackId = existingTarget.trackId;
    }
  }

  setTargets(targets.map(t => {
    if (t.id === id) {
      const targetValue = target.baselineValue !== undefined && target.targetPercentage !== undefined
        ? target.baselineValue * (1 - (target.targetPercentage / 100))
        : target.targetValue !== undefined 
          ? target.targetValue 
          : t.targetValue;
      
      return { 
        ...t, 
        ...target, 
        targetValue,
        updatedAt: getCurrentTimestamp() 
      };
    }
    return t;
  }));
  toast.success(`Updated target: ${target.name || id}`);
};

export const deleteTargetOperation = (
  targets: Target[],
  setTargets: (targets: Target[]) => void,
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  id: string
) => {
  const updatedInitiatives = initiatives.map(initiative => ({
    ...initiative,
    targetIds: initiative.targetIds.filter(targetId => targetId !== id)
  }));
  setInitiatives(updatedInitiatives);
  
  setTargets(targets.filter(t => t.id !== id));
  toast.success(`Deleted target: ${id}`);
};
