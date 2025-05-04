
import { toast } from 'sonner';
import { Initiative, Target } from '@/types';
import { calculateInitiativeAbsoluteValue } from '../../utils';
import { createInitiative as createInitiativeInSupabase } from '@/services/supabase/initiativeService';

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
