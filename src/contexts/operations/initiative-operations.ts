
import { toast } from 'sonner';
import { Initiative, Target } from '@/types';
import { generateId, getCurrentTimestamp, calculateInitiativeAbsoluteValue } from '../utils';
import { 
  createInitiative as createInitiativeInSupabase,
  updateInitiative as updateInitiativeInSupabase,
  deleteInitiative as deleteInitiativeInSupabase,
  addTargetsToInitiative as addTargetsInSupabase,
  removeTargetFromInitiative as removeTargetInSupabase
} from '@/services/supabase/initiativeService';

export const createInitiativeOperation = async (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  targets: Target[],
  extractPercentage: (plan: string) => number,
  initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt' | 'absolute' | 'targetIds'> & { targetIds?: string[] }
) => {
  try {
    const absolute = calculateInitiativeAbsoluteValue(
      { ...initiative, targetIds: initiative.targetIds || [] },
      targets,
      extractPercentage
    );

    const initiativeWithTargets = {
      ...initiative,
      targetIds: initiative.targetIds || [],
      absolute
    };

    const newInitiative = await createInitiativeInSupabase(initiativeWithTargets);
    
    if (newInitiative) {
      setInitiatives([...initiatives, newInitiative]);
      toast.success(`Created initiative: ${initiative.name}`);
    }
  } catch (error) {
    console.error('Error creating initiative:', error);
    toast.error('Failed to create initiative');
  }
};

export const updateInitiativeOperation = async (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  targets: Target[],
  extractPercentage: (plan: string) => number,
  id: string,
  initiative: Partial<Initiative>
) => {
  try {
    // If changing properties that affect absolute value calculation, recalculate it
    let updatedInitiative = { ...initiative };
    
    if (initiative.plan || initiative.targetIds) {
      const currentInitiative = initiatives.find(i => i.id === id);
      if (currentInitiative) {
        const updatedData = {
          ...currentInitiative,
          ...initiative
        };
        
        const absolute = calculateInitiativeAbsoluteValue(
          updatedData,
          targets,
          extractPercentage
        );
        
        updatedInitiative = { ...initiative, absolute };
      }
    }
    
    const result = await updateInitiativeInSupabase(id, updatedInitiative);
    
    if (result) {
      setInitiatives(initiatives.map(i => i.id === id ? result : i));
      toast.success(`Updated initiative: ${initiative.name || id}`);
    }
  } catch (error) {
    console.error('Error updating initiative:', error);
    toast.error('Failed to update initiative');
  }
};

export const deleteInitiativeOperation = async (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  id: string
) => {
  try {
    const success = await deleteInitiativeInSupabase(id);
    
    if (success) {
      setInitiatives(initiatives.filter(i => i.id !== id));
      toast.success(`Deleted initiative: ${id}`);
    }
  } catch (error) {
    console.error('Error deleting initiative:', error);
    toast.error('Failed to delete initiative');
  }
};

export const addTargetsToInitiativeOperation = async (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  initiativeId: string,
  targetIds: string[]
) => {
  try {
    const success = await addTargetsInSupabase(initiativeId, targetIds);
    
    if (success) {
      setInitiatives(initiatives.map(i => {
        if (i.id === initiativeId) {
          const newTargetIds = [...new Set([...i.targetIds, ...targetIds])];
          return { ...i, targetIds: newTargetIds, updatedAt: getCurrentTimestamp() };
        }
        return i;
      }));
      toast.success('Added targets to initiative');
    }
  } catch (error) {
    console.error('Error adding targets to initiative:', error);
    toast.error('Failed to add targets to initiative');
  }
};

export const removeTargetFromInitiativeOperation = async (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  initiativeId: string,
  targetId: string
) => {
  try {
    const success = await removeTargetInSupabase(initiativeId, targetId);
    
    if (success) {
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
    }
  } catch (error) {
    console.error('Error removing target from initiative:', error);
    toast.error('Failed to remove target from initiative');
  }
};
