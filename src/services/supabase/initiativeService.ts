
import { supabase } from "@/integrations/supabase/client";
import { Initiative, InitiativeStatus, TrajectoryType, PlanType } from "@/types";
import { toast } from "sonner";

// Helper functions to ensure type safety
const validateInitiativeStatus = (status: string): InitiativeStatus => {
  const validStatuses: InitiativeStatus[] = ['not_started', 'in_progress', 'completed', 'committed'];
  return validStatuses.includes(status as InitiativeStatus) 
    ? (status as InitiativeStatus) 
    : 'not_started';
};

const validateTrajectoryType = (trajectory: string | null): TrajectoryType => {
  const validTrajectories: TrajectoryType[] = ['every_year', 'linear'];
  return trajectory && validTrajectories.includes(trajectory as TrajectoryType) 
    ? (trajectory as TrajectoryType) 
    : 'linear';
};

const validatePlanType = (plan: string | null): PlanType => {
  const validPlans: PlanType[] = ['-2%', '-4%', '-6%', '-8%', '-10%', '-15%', '-5%'];
  return plan && validPlans.includes(plan as PlanType) 
    ? (plan as PlanType) 
    : '-5%';
};

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

    return {
      id: i.id,
      name: i.name,
      description: i.description || '',
      startDate: i.start_date || new Date().toISOString(),
      endDate: i.end_date || new Date().toISOString(),
      status: validateInitiativeStatus(i.status),
      spend: i.budget || 0,
      trajectory: validateTrajectoryType(i.trajectory),
      plan: validatePlanType(i.plan),
      absolute: i.absolute,
      targetIds: targetIds,
      currency: i.currency || 'USD',
      createdAt: i.created_at,
      updatedAt: i.updated_at
    };
  }) : [];
}

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
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    startDate: data.start_date || new Date().toISOString(),
    endDate: data.end_date || new Date().toISOString(),
    status: validateInitiativeStatus(data.status),
    spend: data.budget || 0,
    trajectory: validateTrajectoryType(data.trajectory),
    plan: validatePlanType(data.plan),
    absolute: data.absolute,
    targetIds: initiative.targetIds,
    currency: data.currency || 'USD',
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function updateInitiative(
  id: string, 
  initiative: Partial<Initiative>
): Promise<Initiative | null> {
  // Prepare the updates for the database
  const updates: any = {};
  
  if (initiative.name !== undefined) updates.name = initiative.name;
  if (initiative.description !== undefined) updates.description = initiative.description;
  if (initiative.status !== undefined) updates.status = initiative.status;
  if (initiative.plan !== undefined) updates.plan = initiative.plan;
  if (initiative.spend !== undefined) updates.budget = initiative.spend;
  if (initiative.absolute !== undefined) updates.absolute = initiative.absolute;
  if (initiative.startDate !== undefined) updates.start_date = initiative.startDate;
  if (initiative.endDate !== undefined) updates.end_date = initiative.endDate;
  if (initiative.trajectory !== undefined) updates.trajectory = initiative.trajectory;
  if (initiative.currency !== undefined) updates.currency = initiative.currency;

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
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    startDate: data.start_date || new Date().toISOString(),
    endDate: data.end_date || new Date().toISOString(),
    status: validateInitiativeStatus(data.status),
    spend: data.budget || 0,
    trajectory: validateTrajectoryType(data.trajectory),
    plan: validatePlanType(data.plan),
    absolute: data.absolute,
    targetIds: targetIds,
    currency: data.currency || 'USD',
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

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
