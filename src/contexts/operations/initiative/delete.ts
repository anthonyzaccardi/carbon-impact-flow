
import { toast } from 'sonner';
import { Initiative } from '@/types';
import { deleteInitiative as deleteInitiativeInSupabase } from '@/services/supabase/initiativeService';

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
