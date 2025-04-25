
import { Track, Factor, Measurement, Target, Initiative, Scenario, Supplier } from '../types';
import { generateId, getCurrentTimestamp, calculateInitiativeAbsoluteValue } from './utils';
import { toast } from 'sonner';

export const createTrackOperation = (
  tracks: Track[],
  setTracks: (tracks: Track[]) => void,
  track: Omit<Track, 'id' | 'createdAt' | 'updatedAt' | 'totalEmissions'>
) => {
  const newTrack: Track = {
    ...track,
    totalEmissions: 0,
    id: generateId('track'),
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  };
  setTracks([...tracks, newTrack]);
  toast.success(`Created track: ${track.name}`);
};

export const updateTrackOperation = (
  tracks: Track[],
  setTracks: (tracks: Track[]) => void,
  id: string,
  track: Partial<Track>
) => {
  setTracks(tracks.map(t => 
    t.id === id ? { ...t, ...track, updatedAt: getCurrentTimestamp() } : t
  ));
  toast.success(`Updated track: ${track.name || id}`);
};

export const deleteTrackOperation = (
  tracks: Track[],
  factors: Factor[],
  measurements: Measurement[],
  targets: Target[],
  setTracks: (tracks: Track[]) => void,
  id: string
) => {
  const hasFactors = factors.some(f => f.trackId === id);
  const hasMeasurements = measurements.some(m => m.trackId === id);
  const hasTargets = targets.some(t => t.trackId === id);
  
  if (hasFactors || hasMeasurements || hasTargets) {
    toast.error(`Cannot delete track: it's in use by factors, measurements, or targets`);
    return;
  }
  
  setTracks(tracks.filter(t => t.id !== id));
  toast.success(`Deleted track: ${id}`);
};

// ... Continue with other CRUD operations following the same pattern
