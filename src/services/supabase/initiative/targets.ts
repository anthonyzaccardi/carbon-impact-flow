
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function addTargetsToInitiative(
  initiativeId: string, 
  targetIds: string[]
): Promise<boolean> {
  // Create association records
  const initiativeTargets = targetIds.map(targetId => ({
    initiative_id: initiativeId,
    target_id: targetId
  }));

  const { error } = await supabase
    .from('initiative_targets')
    .insert(initiativeTargets);

  if (error) {
    console.error('Error adding targets to initiative:', error);
    toast.error(`Failed to add targets to initiative: ${error.message}`);
    return false;
  }

  return true;
}

export async function removeTargetFromInitiative(
  initiativeId: string,
  targetId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('initiative_targets')
    .delete()
    .eq('initiative_id', initiativeId)
    .eq('target_id', targetId);

  if (error) {
    console.error('Error removing target from initiative:', error);
    toast.error(`Failed to remove target from initiative: ${error.message}`);
    return false;
  }

  return true;
}
