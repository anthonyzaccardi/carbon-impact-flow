import { toast } from 'sonner';
import { Target, Initiative } from '@/types';
import { generateId, getCurrentTimestamp } from '../utils';
import { 
  createTarget as createTargetInSupabase,
  updateTarget as updateTargetInSupabase, 
  deleteTarget as deleteTargetInSupabase
} from '@/services/supabase/targetService';

export const createTargetOperation = async (
  targets: Target[],
  setTargets: (targets: Target[]) => void,
  target: Omit<Target, 'id' | 'createdAt' | 'updatedAt' | 'targetValue'>
) => {
  if (!target.trackId) {
    toast.error('Target must be associated with a track');
    return;
  }

  // Check if supplier is already assigned to another target
  if (target.supplierId && targets.some(t => t.supplierId === target.supplierId)) {
    toast.error('This supplier is already assigned to another target');
    return;
  }

  try {
    // Calculate target value
    const targetValue = target.baselineValue * (1 - (target.targetPercentage / 100));
    
    // Create target in Supabase
    const newTarget = await createTargetInSupabase({
      ...target,
      targetValue
    });
    
    if (newTarget) {
      // Update local state
      setTargets([...targets, newTarget]);
      toast.success(`Created target: ${target.name}`);
    }
  } catch (error) {
    console.error('Error in createTargetOperation:', error);
    toast.error('Failed to create target');
  }
};

export const updateTargetOperation = async (
  targets: Target[],
  setTargets: (targets: Target[]) => void,
  id: string,
  target: Partial<Target>
) => {
  // Check if supplier is already assigned to another target
  if (target.supplierId && targets.some(t => t.id !== id && t.supplierId === target.supplierId)) {
    toast.error('This supplier is already assigned to another target');
    return;
  }

  if (target.trackId === undefined) {
    const existingTarget = targets.find(t => t.id === id);
    if (existingTarget) {
      target.trackId = existingTarget.trackId;
    }
  }

  // Ensure targetDate remains as a string or we keep the existing one
  const targetDate = target.targetDate || undefined;

  try {
    // Update target in Supabase
    const updatedTarget = await updateTargetInSupabase(id, target);
    
    if (updatedTarget) {
      // Update local state
      setTargets(targets.map(t => t.id === id ? updatedTarget : t));
      toast.success(`Updated target: ${target.name || id}`);
    }
  } catch (error) {
    console.error('Error in updateTargetOperation:', error);
    toast.error('Failed to update target');
  }
};

export const deleteTargetOperation = async (
  targets: Target[],
  setTargets: (targets: Target[]) => void,
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  id: string
) => {
  try {
    // Delete from Supabase
    const success = await deleteTargetInSupabase(id);
    
    if (success) {
      // Update local state for initiatives (remove target references)
      const updatedInitiatives = initiatives.map(initiative => ({
        ...initiative,
        targetIds: initiative.targetIds.filter(targetId => targetId !== id)
      }));
      setInitiatives(updatedInitiatives);
      
      // Update local state for targets
      setTargets(targets.filter(t => t.id !== id));
      toast.success(`Deleted target: ${id}`);
    }
  } catch (error) {
    console.error('Error in deleteTargetOperation:', error);
    toast.error('Failed to delete target');
  }
};
