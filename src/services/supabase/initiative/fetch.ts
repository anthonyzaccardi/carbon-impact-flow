
import { supabase } from "@/integrations/supabase/client";
import { Initiative } from "@/types";
import { toast } from "sonner";
import { mapDatabaseToInitiative } from "./mappers";

export async function fetchInitiatives(): Promise<Initiative[]> {
  // First, get all initiatives
  const { data: initiatives, error: initiativesError } = await supabase
    .from('initiatives')
    .select('*')
    .order('created_at', { ascending: false });

  if (initiativesError) {
    console.error('Error fetching initiatives:', initiativesError);
    toast.error('Failed to load initiatives');
    return [];
  }

  // Then, get all initiative-target associations
  const { data: initiativeTargets, error: targetsError } = await supabase
    .from('initiative_targets')
    .select('*');

  if (targetsError) {
    console.error('Error fetching initiative targets:', targetsError);
    toast.error('Failed to load initiative target relationships');
    return [];
  }

  // Map the data to the frontend model
  return initiatives ? initiatives.map(i => {
    // Find all target IDs associated with this initiative
    const targetIds = initiativeTargets
      ? initiativeTargets
          .filter(it => it.initiative_id === i.id)
          .map(it => it.target_id)
      : [];

    return mapDatabaseToInitiative(i, targetIds);
  }) : [];
}
