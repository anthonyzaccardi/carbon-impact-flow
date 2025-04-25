
import { useEffect } from 'react';
import { Track, Target } from '@/types';

export const useEffects = (
  tracks: Track[],
  setTracks: (tracks: Track[]) => void,
  targets: Target[],
  setTargets: (targets: Target[]) => void,
  calculateTrackMeasurementsValue: (trackId: string) => number
) => {
  useEffect(() => {
    const updatedTracks = tracks.map(track => ({
      ...track,
      totalEmissions: calculateTrackMeasurementsValue(track.id)
    }));
    
    if (JSON.stringify(updatedTracks) !== JSON.stringify(tracks)) {
      setTracks(updatedTracks);
    }
  }, [tracks, calculateTrackMeasurementsValue, setTracks]);

  useEffect(() => {
    const updatedTargets = targets.map(target => {
      const targetValue = target.baselineValue * (1 - (target.targetPercentage / 100));
      if (target.targetValue !== targetValue) {
        return { ...target, targetValue };
      }
      return target;
    });
    
    if (JSON.stringify(updatedTargets) !== JSON.stringify(targets)) {
      setTargets(updatedTargets);
    }
  }, [targets, setTargets]);
};
