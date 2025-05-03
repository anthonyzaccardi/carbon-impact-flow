
import { supabase } from "@/integrations/supabase/client";
import { Factor } from "@/types";
import { toast } from "sonner";

export async function fetchFactors(): Promise<Factor[]> {
  const { data, error } = await supabase
    .from('factors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching factors:', error);
    toast.error('Failed to load factors');
    return [];
  }

  return data ? data.map(factor => ({
    id: factor.id,
    trackId: factor.track_id,
    name: factor.name,
    value: factor.value,
    unit: factor.unit,
    category: factor.category,
    createdAt: factor.created_at,
    updatedAt: factor.updated_at
  })) : [];
}

export async function createFactor(factor: Omit<Factor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Factor | null> {
  const newFactor = {
    track_id: factor.trackId,
    name: factor.name,
    value: factor.value,
    unit: factor.unit,
    category: factor.category
  };

  const { data, error } = await supabase
    .from('factors')
    .insert([newFactor])
    .select()
    .single();

  if (error) {
    console.error('Error creating factor:', error);
    toast.error(`Failed to create factor: ${error.message}`);
    return null;
  }

  return {
    id: data.id,
    trackId: data.track_id,
    name: data.name,
    value: data.value,
    unit: data.unit,
    category: data.category,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function updateFactor(id: string, factor: Partial<Factor>): Promise<Factor | null> {
  const updates = {
    ...(factor.trackId && { track_id: factor.trackId }),
    ...(factor.name && { name: factor.name }),
    ...(factor.value !== undefined && { value: factor.value }),
    ...(factor.unit && { unit: factor.unit }),
    ...(factor.category && { category: factor.category })
  };

  const { data, error } = await supabase
    .from('factors')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating factor:', error);
    toast.error(`Failed to update factor: ${error.message}`);
    return null;
  }

  return {
    id: data.id,
    trackId: data.track_id,
    name: data.name,
    value: data.value,
    unit: data.unit,
    category: data.category,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function deleteFactor(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('factors')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting factor:', error);
    toast.error(`Failed to delete factor: ${error.message}`);
    return false;
  }

  return true;
}
