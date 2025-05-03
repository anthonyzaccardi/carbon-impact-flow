
import { supabase } from "@/integrations/supabase/client";
import { Scenario } from "@/types";
import { toast } from "sonner";

export async function fetchScenarios(): Promise<Scenario[]> {
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching scenarios:', error);
    toast.error('Failed to load scenarios');
    return [];
  }

  return data ? data.map(s => ({
    id: s.id,
    name: s.name,
    createdAt: s.created_at,
    updatedAt: s.updated_at
  })) : [];
}

export async function createScenario(scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>): Promise<Scenario | null> {
  const newScenario = {
    name: scenario.name
  };

  const { data, error } = await supabase
    .from('scenarios')
    .insert([newScenario])
    .select()
    .single();

  if (error) {
    console.error('Error creating scenario:', error);
    toast.error(`Failed to create scenario: ${error.message}`);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function updateScenario(id: string, scenario: Partial<Scenario>): Promise<Scenario | null> {
  const updates = {
    ...(scenario.name && { name: scenario.name })
  };

  const { data, error } = await supabase
    .from('scenarios')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating scenario:', error);
    toast.error(`Failed to update scenario: ${error.message}`);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function deleteScenario(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('scenarios')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting scenario:', error);
    toast.error(`Failed to delete scenario: ${error.message}`);
    return false;
  }

  return true;
}
