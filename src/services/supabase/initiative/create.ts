
import { supabase } from "@/integrations/supabase/client";
import { Initiative } from "@/types";
import { toast } from "sonner";
import { mapDatabaseToInitiative } from "./mappers";

export async function createInitiative(
  initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt' | 'absolute'> & { targetIds: string[] }
): Promise<Initiative | null> {
  // Format the initiative data for the database
  const newInitiative = {
    name: initiative.name,
    description: initiative.description,
    status: initiative.status,
    plan: initiative.plan,
    budget: initiative.spend,
    absolute: 0, // This will be calculated based on targets
    start_date: initiative.startDate,
    end_date: initiative.endDate,
    trajectory: initiative.trajectory,
    currency: initiative.currency
  };

  // Insert the initiative
  const { data, error } = await supabase
    .from('initiatives')
    .insert([newInitiative])
    .select()
    .single();

  if (error) {
    console.error('Error creating initiative:', error);
    toast.error(`Failed to create initiative: ${error.message}`);
    return null;
  }

  // Associate targets if there are any
  if (initiative.targetIds.length > 0) {
    const initiativeTargets = initiative.targetIds.map(targetId => ({
      initiative_id: data.id,
      target_id: targetId
    }));

    const { error: targetsError } = await supabase
      .from('initiative_targets')
      .insert(initiativeTargets);

    if (targetsError) {
      console.error('Error associating targets with initiative:', targetsError);
      toast.error(`Failed to associate targets with initiative: ${targetsError.message}`);
      // We don't return null here because the initiative was created successfully,
      // we just couldn't associate all targets
    }
  }

  // Return the created initiative with the associated target IDs
  return mapDatabaseToInitiative(data, initiative.targetIds);
}
