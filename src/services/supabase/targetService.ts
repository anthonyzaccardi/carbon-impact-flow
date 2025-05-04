
import { supabase } from "@/integrations/supabase/client";
import { Target, Status } from "@/types";
import { toast } from "sonner";

export async function fetchTargets(): Promise<Target[]> {
  const { data, error } = await supabase
    .from('targets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching targets:', error);
    toast.error('Failed to load targets');
    return [];
  }

  return data ? data.map(t => ({
    id: t.id,
    trackId: t.track_id,
    scenarioId: t.scenario_id,
    supplierId: t.supplier_id,
    name: t.name,
    description: t.description || '',
    baselineValue: t.baseline_value,
    targetValue: t.target_value,
    targetPercentage: t.target_percentage,
    targetDate: t.target_date,
    status: t.status as Status || 'not_started',
    createdAt: t.created_at,
    updatedAt: t.updated_at
  })) : [];
}

export async function createTarget(target: Omit<Target, 'id' | 'createdAt' | 'updatedAt'>): Promise<Target | null> {
  // Calculate target value based on baseline and percentage
  const targetValue = target.baselineValue * (1 - (target.targetPercentage / 100));
  
  const newTarget = {
    track_id: target.trackId,
    scenario_id: target.scenarioId,
    supplier_id: target.supplierId,
    name: target.name,
    description: target.description || '',
    baseline_value: target.baselineValue,
    target_value: targetValue, // Use calculated target value
    target_percentage: target.targetPercentage,
    target_date: target.targetDate,
    status: target.status || 'not_started'
  };

  const { data, error } = await supabase
    .from('targets')
    .insert([newTarget])
    .select()
    .single();

  if (error) {
    console.error('Error creating target:', error);
    toast.error(`Failed to create target: ${error.message}`);
    return null;
  }

  return {
    id: data.id,
    trackId: data.track_id,
    scenarioId: data.scenario_id,
    supplierId: data.supplier_id,
    name: data.name,
    description: data.description || '',
    baselineValue: data.baseline_value,
    targetValue: data.target_value,
    targetPercentage: data.target_percentage,
    targetDate: data.target_date,
    status: data.status as Status || 'not_started',
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function updateTarget(id: string, target: Partial<Target>): Promise<Target | null> {
  // Calculate target value if both baseline and percentage are provided
  let targetValue = target.targetValue;
  if (target.baselineValue !== undefined && target.targetPercentage !== undefined) {
    targetValue = target.baselineValue * (1 - (target.targetPercentage / 100));
  }

  const updates = {
    ...(target.trackId && { track_id: target.trackId }),
    ...(target.scenarioId !== undefined && { scenario_id: target.scenarioId }),
    ...(target.supplierId !== undefined && { supplier_id: target.supplierId }),
    ...(target.name && { name: target.name }),
    ...(target.description !== undefined && { description: target.description }),
    ...(target.baselineValue !== undefined && { baseline_value: target.baselineValue }),
    ...(targetValue !== undefined && { target_value: targetValue }),
    ...(target.targetPercentage !== undefined && { target_percentage: target.targetPercentage }),
    ...(target.targetDate && { target_date: target.targetDate }),
    ...(target.status && { status: target.status })
  };

  const { data, error } = await supabase
    .from('targets')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating target:', error);
    toast.error(`Failed to update target: ${error.message}`);
    return null;
  }

  return {
    id: data.id,
    trackId: data.track_id,
    scenarioId: data.scenario_id,
    supplierId: data.supplier_id,
    name: data.name,
    description: data.description || '',
    baselineValue: data.baseline_value,
    targetValue: data.target_value,
    targetPercentage: data.target_percentage,
    targetDate: data.target_date,
    status: data.status as Status || 'not_started',
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function deleteTarget(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('targets')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting target:', error);
    toast.error(`Failed to delete target: ${error.message}`);
    return false;
  }

  return true;
}
