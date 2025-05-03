import { supabase } from "@/integrations/supabase/client";
import { Initiative, InitiativeStatus, PlanType } from "@/types";
import { toast } from "sonner";

export async function fetchInitiatives(): Promise<Initiative[]> {
  const { data, error } = await supabase
    .from('initiatives')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching initiatives:', error);
    toast.error('Failed to load initiatives');
    return [];
  }

  // Get target associations for all initiatives
  const { data: initiativeTargets, error: targetsError } = await supabase
    .from('initiative_targets')
    .select('*');

  if (targetsError) {
    console.error('Error fetching initiative targets:', targetsError);
  }

  // Create a map of initiative ID to target IDs
  const initiativeTargetsMap: Record<string, string[]> = {};
  if (initiativeTargets) {
    initiativeTargets.forEach(it => {
      if (!initiativeTargetsMap[it.initiative_id]) {
        initiativeTargetsMap[it.initiative_id] = [];
      }
      initiativeTargetsMap[it.initiative_id].push(it.target_id);
    });
  }

  return data ? data.map(i => ({
    id: i.id,
    name: i.name,
    description: i.description || '',
    startDate: new Date().toISOString(), // Default value as it's missing in the DB
    endDate: new Date().toISOString(),   // Default value as it's missing in the DB
    status: i.status as InitiativeStatus,
    spend: i.budget || 0,
    trajectory: 'linear', // Default value as it's missing in the DB
    plan: (i.plan || '-5%') as PlanType,
    absolute: i.absolute,
    currency: 'USD', // Default value as it's missing in the DB
    targetIds: initiativeTargetsMap[i.id] || [],
    createdAt: i.created_at,
    updatedAt: i.updated_at
  })) : [];
}

export async function createInitiative(initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt'>): Promise<Initiative | null> {
  const newInitiative = {
    name: initiative.name,
    description: initiative.description,
    status: initiative.status,
    plan: initiative.plan,
    budget: initiative.spend,
    absolute: initiative.absolute,
    // These fields are missing in our DB schema, but required by our types
    // We'll need to modify the schema later if needed
  };

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

  // Associate targets if provided
  if (initiative.targetIds && initiative.targetIds.length > 0) {
    const initiativeTargets = initiative.targetIds.map(targetId => ({
      initiative_id: data.id,
      target_id: targetId
    }));

    const { error: targetsError } = await supabase
      .from('initiative_targets')
      .insert(initiativeTargets);

    if (targetsError) {
      console.error('Error associating targets with initiative:', targetsError);
      toast.error('Created initiative but failed to associate targets');
    }
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    startDate: new Date().toISOString(), // Default value as it's missing in the DB
    endDate: new Date().toISOString(),   // Default value as it's missing in the DB
    status: data.status as InitiativeStatus,
    spend: data.budget || 0,
    trajectory: 'linear', // Default value as it's missing in the DB
    plan: (data.plan || '-5%') as PlanType,
    absolute: data.absolute,
    currency: 'USD', // Default value as it's missing in the DB
    targetIds: initiative.targetIds || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function updateInitiative(id: string, initiative: Partial<Initiative>): Promise<Initiative | null> {
  const updates = {
    ...(initiative.name && { name: initiative.name }),
    ...(initiative.description !== undefined && { description: initiative.description }),
    ...(initiative.status && { status: initiative.status }),
    ...(initiative.plan && { plan: initiative.plan }),
    ...(initiative.spend !== undefined && { budget: initiative.spend }),
    ...(initiative.absolute !== undefined && { absolute: initiative.absolute })
    // The missing fields will need schema modifications
  };

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

  // If targetIds are being updated, update the junction table
  if (initiative.targetIds) {
    // First delete all existing associations
    const { error: deleteError } = await supabase
      .from('initiative_targets')
      .delete()
      .eq('initiative_id', id);

    if (deleteError) {
      console.error('Error removing existing target associations:', deleteError);
    }

    // Then add the new ones
    if (initiative.targetIds.length > 0) {
      const initiativeTargets = initiative.targetIds.map(targetId => ({
        initiative_id: id,
        target_id: targetId
      }));

      const { error: insertError } = await supabase
        .from('initiative_targets')
        .insert(initiativeTargets);

      if (insertError) {
        console.error('Error adding new target associations:', insertError);
        toast.error('Updated initiative but failed to update target associations');
      }
    }
  }

  // Need to fetch the current target associations
  const { data: initiativeTargets } = await supabase
    .from('initiative_targets')
    .select('target_id')
    .eq('initiative_id', id);

  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    startDate: new Date().toISOString(), // Default value as it's missing in the DB
    endDate: new Date().toISOString(),   // Default value as it's missing in the DB
    status: data.status as InitiativeStatus,
    spend: data.budget || 0,
    trajectory: 'linear', // Default value as it's missing in the DB
    plan: (data.plan || '-5%') as PlanType,
    absolute: data.absolute,
    currency: 'USD', // Default value as it's missing in the DB
    targetIds: initiativeTargets ? initiativeTargets.map(it => it.target_id) : [],
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function deleteInitiative(id: string): Promise<boolean> {
  // Delete from junction table first (cascade should handle this, but being explicit)
  const { error: junctionError } = await supabase
    .from('initiative_targets')
    .delete()
    .eq('initiative_id', id);

  if (junctionError) {
    console.error('Error deleting initiative associations:', junctionError);
  }

  // Delete the initiative
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

export async function addTargetsToInitiative(initiativeId: string, targetIds: string[]): Promise<boolean> {
  const initiativeTargets = targetIds.map(targetId => ({
    initiative_id: initiativeId,
    target_id: targetId
  }));

  const { error } = await supabase
    .from('initiative_targets')
    .insert(initiativeTargets);

  if (error) {
    console.error('Error adding targets to initiative:', error);
    toast.error(`Failed to associate targets: ${error.message}`);
    return false;
  }

  return true;
}

export async function removeTargetFromInitiative(initiativeId: string, targetId: string): Promise<boolean> {
  const { error } = await supabase
    .from('initiative_targets')
    .delete()
    .eq('initiative_id', initiativeId)
    .eq('target_id', targetId);

  if (error) {
    console.error('Error removing target from initiative:', error);
    toast.error(`Failed to remove target association: ${error.message}`);
    return false;
  }

  return true;
}
