
import { toast } from 'sonner';
import { Initiative } from '@/types';
import { getCurrentTimestamp } from '../../utils';
import { 
  addTargetsToInitiative as addTargetsInSupabase,
  removeTargetFromInitiative as removeTargetInSupabase 
} from '@/services/supabase/initiativeService';

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
