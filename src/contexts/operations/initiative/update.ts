
import { toast } from 'sonner';
import { Initiative, Target } from '@/types';
import { calculateInitiativeAbsoluteValue } from '../../utils';
import { updateInitiative as updateInitiativeInSupabase } from '@/services/supabase/initiativeService';

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
