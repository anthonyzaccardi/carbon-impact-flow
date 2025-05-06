
import { supabase } from "@/integrations/supabase/client";
import { Scenario } from "@/types";
import { toast } from "sonner";

export async function fetchScenarios(): Promise<Scenario[]> {
  console.log("Fetching scenarios from Supabase...");
  
  try {
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scenarios:', error);
      toast.error('Failed to load scenarios');
      throw error;
    }

    console.log("Supabase scenarios response:", data);

    if (!data) {
      console.warn("No scenarios data returned from Supabase");
      return [];
    }

    const mappedScenarios = data.map(s => ({
      id: s.id,
      name: s.name,
      createdAt: s.created_at,
      updatedAt: s.updated_at
    }));

    console.log("Mapped scenarios:", mappedScenarios);
    return mappedScenarios;
  } catch (error) {
    console.error("Exception in fetchScenarios:", error);
    toast.error('Failed to load scenarios due to an unexpected error');
    throw error;
  }
}

export async function createScenario(scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>): Promise<Scenario | null> {
  const newScenario = {
    name: scenario.name
  };

  try {
    const { data, error } = await supabase
      .from('scenarios')
      .insert([newScenario])
      .select()
      .single();

    if (error) {
      console.error('Error creating scenario:', error);
      toast.error(`Failed to create scenario: ${error.message}`);
      throw error;
    }

    if (!data) {
      console.warn("No data returned after creating scenario");
      toast.error("Failed to create scenario: No response data");
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error("Exception in createScenario:", error);
    toast.error('Failed to create scenario due to an unexpected error');
    throw error;
  }
}

export async function updateScenario(id: string, scenario: Partial<Scenario>): Promise<Scenario | null> {
  const updates = {
    ...(scenario.name && { name: scenario.name })
  };

  try {
    const { data, error } = await supabase
      .from('scenarios')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating scenario:', error);
      toast.error(`Failed to update scenario: ${error.message}`);
      throw error;
    }

    if (!data) {
      console.warn("No data returned after updating scenario");
      toast.error("Failed to update scenario: No response data");
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error("Exception in updateScenario:", error);
    toast.error('Failed to update scenario due to an unexpected error');
    throw error;
  }
}

export async function deleteScenario(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('scenarios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting scenario:', error);
      toast.error(`Failed to delete scenario: ${error.message}`);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Exception in deleteScenario:", error);
    toast.error('Failed to delete scenario due to an unexpected error');
    throw error;
  }
}
