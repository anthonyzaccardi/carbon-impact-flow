
import { supabase } from "@/integrations/supabase/client";
import { Track } from "@/types";
import { toast } from "sonner";

export async function fetchTracks(): Promise<Track[]> {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tracks:', error);
    toast.error('Failed to load tracks');
    return [];
  }

  return data ? data.map(track => ({
    id: track.id,
    name: track.name,
    emoji: track.emoji,
    totalEmissions: track.total_emissions,
    createdAt: track.created_at,
    updatedAt: track.updated_at
  })) : [];
}

export async function createTrack(track: Omit<Track, 'id' | 'createdAt' | 'updatedAt' | 'totalEmissions'>): Promise<Track | null> {
  const newTrack = {
    name: track.name,
    emoji: track.emoji,
    total_emissions: 0
  };

  const { data, error } = await supabase
    .from('tracks')
    .insert([newTrack])
    .select()
    .single();

  if (error) {
    console.error('Error creating track:', error);
    toast.error(`Failed to create track: ${error.message}`);
    return null;
  }

  // Convert from snake_case (database) to camelCase (frontend)
  return {
    id: data.id,
    name: data.name,
    emoji: data.emoji,
    totalEmissions: data.total_emissions,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function updateTrack(id: string, track: Partial<Track>): Promise<Track | null> {
  // Convert from camelCase (frontend) to snake_case (database)
  const updates = {
    ...(track.name && { name: track.name }),
    ...(track.emoji && { emoji: track.emoji }),
    ...(track.totalEmissions !== undefined && { total_emissions: track.totalEmissions })
  };

  const { data, error } = await supabase
    .from('tracks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating track:', error);
    toast.error(`Failed to update track: ${error.message}`);
    return null;
  }

  // Convert from snake_case (database) to camelCase (frontend)
  return {
    id: data.id,
    name: data.name,
    emoji: data.emoji,
    totalEmissions: data.total_emissions,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function deleteTrack(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('tracks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting track:', error);
    toast.error(`Failed to delete track: ${error.message}`);
    return false;
  }

  return true;
}
