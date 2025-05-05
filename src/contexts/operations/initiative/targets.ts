
import { toast } from 'sonner';
import { Initiative } from '@/types';
import { 
  addTargetsToInitiative as addTargetsToInitiativeInSupabase,
  removeTargetFromInitiative as removeTargetFromInitiativeInSupabase
} from '@/services/supabase/initiativeService';

export const addTargetsToInitiativeOperation = async (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  initiativeId: string,
  targetIds: string[]
) => {
  try {
    // Update in Supabase
    const success = await addTargetsToInitiativeInSupabase(initiativeId, targetIds);
    
    if (success) {
      // Update local state
      const updatedInitiatives = initiatives.map(initiative => {
        if (initiative.id === initiativeId) {
          // Add the target IDs if they don't already exist
          const updatedTargetIds = [...new Set([...initiative.targetIds, ...targetIds])];
          return {
            ...initiative,
            targetIds: updatedTargetIds
          };
        }
        return initiative;
      });
      
      setInitiatives(updatedInitiatives);
      toast.success(`Attached ${targetIds.length} target${targetIds.length === 1 ? '' : 's'} to initiative`);
    }
  } catch (error) {
    console.error('Error in addTargetsToInitiativeOperation:', error);
    toast.error('Failed to attach targets to initiative');
  }
};

export const removeTargetFromInitiativeOperation = async (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  initiativeId: string,
  targetId: string
) => {
  try {
    // Update in Supabase
    const success = await removeTargetFromInitiativeInSupabase(initiativeId, targetId);
    
    if (success) {
      // Update local state
      const updatedInitiatives = initiatives.map(initiative => {
        if (initiative.id === initiativeId) {
          return {
            ...initiative,
            targetIds: initiative.targetIds.filter(id => id !== targetId)
          };
        }
        return initiative;
      });
      
      setInitiatives(updatedInitiatives);
      toast.success('Target removed from initiative');
    }
  } catch (error) {
    console.error('Error in removeTargetFromInitiativeOperation:', error);
    toast.error('Failed to remove target from initiative');
  }
};
