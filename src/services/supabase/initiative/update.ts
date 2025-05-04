
import { supabase } from "@/integrations/supabase/client";
import { Initiative } from "@/types";
import { toast } from "sonner";
import { mapDatabaseToInitiative, mapInitiativeToDatabase } from "./mappers";

export async function updateInitiative(
  id: string, 
  initiative: Partial<Initiative>
): Promise<Initiative | null> {
  // Prepare the updates for the database
  const updates = mapInitiativeToDatabase(initiative);

  // Update the initiative
  const { data, error } = await supabase
    .from('initiatives')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating initiative:', error);
    toast.error(`Failed to update initiative: ${error.message}`);
    return null;
  }

  // If targetIds are provided, update the initiative-target associations
  if (initiative.targetIds !== undefined) {
    // First, remove all existing associations
    const { error: deleteError } = await supabase
      .from('initiative_targets')
      .delete()
      .eq('initiative_id', id);

    if (deleteError) {
      console.error('Error removing initiative target associations:', deleteError);
      toast.error(`Failed to update initiative targets: ${deleteError.message}`);
    } else if (initiative.targetIds.length > 0) {
      // Then, add the new associations
      const initiativeTargets = initiative.targetIds.map(targetId => ({
        initiative_id: id,
        target_id: targetId
      }));

      const { error: insertError } = await supabase
        .from('initiative_targets')
        .insert(initiativeTargets);

      if (insertError) {
        console.error('Error adding initiative target associations:', insertError);
        toast.error(`Failed to update initiative targets: ${insertError.message}`);
      }
    }
  }

  // Get the current target IDs for this initiative
  const { data: initiativeTargets } = await supabase
    .from('initiative_targets')
    .select('target_id')
    .eq('initiative_id', id);

  const targetIds = initiativeTargets ? initiativeTargets.map(it => it.target_id) : [];

  // Return the updated initiative
  return mapDatabaseToInitiative(data, targetIds);
}
