
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function deleteInitiative(id: string): Promise<boolean> {
  // The initiative_targets associations will be automatically removed
  // due to the ON DELETE CASCADE constraint
  const { error } = await supabase
    .from('initiatives')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting initiative:', error);
    toast.error(`Failed to delete initiative: ${error.message}`);
    return false;
  }

  return true;
}
