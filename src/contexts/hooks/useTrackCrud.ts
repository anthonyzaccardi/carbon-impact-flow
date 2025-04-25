
import { Track, Factor, Measurement, Target } from '@/types';
import { createTrackOperation, updateTrackOperation, deleteTrackOperation } from '../operations';

export const useTrackCrud = (
  tracks: Track[],
  setTracks: (tracks: Track[]) => void,
  factors: Factor[],
  measurements: Measurement[],
  targets: Target[]
) => {
  const createTrack = (track: Omit<Track, 'id' | 'createdAt' | 'updatedAt' | 'totalEmissions'>) => {
    createTrackOperation(tracks, setTracks, track);
  };

  const updateTrack = (id: string, track: Partial<Track>) => {
    updateTrackOperation(tracks, setTracks, id, track);
  };

  const deleteTrack = (id: string) => {
    deleteTrackOperation(tracks, factors, measurements, targets, setTracks, id);
  };

  return {
    createTrack,
    updateTrack,
    deleteTrack
  };
};
