
import { toast } from 'sonner';
import { Track, Factor, Measurement, Target } from '@/types';
import { generateId, getCurrentTimestamp } from '../utils';
import { 
  createTrack as createTrackInSupabase,
  updateTrack as updateTrackInSupabase,
  deleteTrack as deleteTrackInSupabase
} from '@/services/supabase/trackService';

export const createTrackOperation = async (
  tracks: Track[],
  setTracks: (tracks: Track[]) => void,
  track: Omit<Track, 'id' | 'createdAt' | 'updatedAt' | 'totalEmissions'>
) => {
  try {
    // Create the track in Supabase
    const newTrack = await createTrackInSupabase(track);
    
    if (newTrack) {
      // Update local state
      setTracks([...tracks, newTrack]);
      toast.success(`Created track: ${track.name}`);
      return newTrack.id;
    }
    return "";
  } catch (error) {
    console.error('Error in createTrackOperation:', error);
    toast.error('Failed to create track');
    return "";
  }
};

export const updateTrackOperation = async (
  tracks: Track[],
  setTracks: (tracks: Track[]) => void,
  id: string,
  trackUpdates: Partial<Track>
) => {
  try {
    // Update the track in Supabase
    const updatedTrack = await updateTrackInSupabase(id, trackUpdates);
    
    if (updatedTrack) {
      // Update local state
      setTracks(tracks.map(t => 
        t.id === id ? { ...t, ...trackUpdates, updatedAt: getCurrentTimestamp() } : t
      ));
      toast.success(`Updated track: ${trackUpdates.name || id}`);
    }
  } catch (error) {
    console.error('Error in updateTrackOperation:', error);
    toast.error('Failed to update track');
  }
};

export const deleteTrackOperation = async (
  tracks: Track[],
  factors: Factor[],
  measurements: Measurement[],
  targets: Target[],
  setTracks: (tracks: Track[]) => void,
  id: string
) => {
  // Check if track has related records before delete
  const hasFactors = factors.some(f => f.trackId === id);
  const hasMeasurements = measurements.some(m => m.trackId === id);
  const hasTargets = targets.some(t => t.trackId === id);
  
  if (hasFactors || hasMeasurements || hasTargets) {
    toast.error(`Cannot delete track: it's in use by factors, measurements, or targets`);
    return;
  }
  
  try {
    // Delete from Supabase
    const success = await deleteTrackInSupabase(id);
    
    if (success) {
      // Update local state
      setTracks(tracks.filter(t => t.id !== id));
      toast.success(`Deleted track`);
    }
  } catch (error) {
    console.error('Error in deleteTrackOperation:', error);
    toast.error('Failed to delete track');
  }
};
