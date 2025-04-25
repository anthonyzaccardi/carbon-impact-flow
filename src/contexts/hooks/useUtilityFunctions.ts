
import { AppContextType } from '../types';
import { Factor, Measurement, Initiative, Track, Target } from '@/types';

export const useUtilityFunctions = (
  tracks: Track[],
  factors: Factor[],
  measurements: Measurement[],
  targets: Target[],
  initiatives: Initiative[]
) => {
  const calculateTrackMeasurementsValue = (trackId: string): number => {
    const trackMeasurements = measurements.filter(m => m.trackId === trackId);
    return trackMeasurements.reduce((sum, measurement) => sum + measurement.calculatedValue, 0);
  };
  
  const extractPercentage = (plan: string): number => {
    return parseFloat(plan.replace('%', '')) / 100;
  };
  
  const getFactorUnit = (factorId: string): string => {
    const factor = factors.find(f => f.id === factorId);
    return factor ? factor.unit : 'tCO2e';
  };
  
  const getInitiativesForTarget = (targetId: string): Initiative[] => {
    return initiatives.filter(i => i.targetIds.includes(targetId));
  };
  
  const getTrackStats = (trackId: string) => {
    return {
      factorsCount: factors.filter(f => f.trackId === trackId).length,
      measurementsCount: measurements.filter(m => m.trackId === trackId).length,
      targetsCount: targets.filter(t => t.trackId === trackId).length
    };
  };

  return {
    calculateTrackMeasurementsValue,
    extractPercentage,
    getFactorUnit,
    getInitiativesForTarget,
    getTrackStats
  };
};
