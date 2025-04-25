
import { Factor, Measurement } from '@/types';
import { createFactorOperation, updateFactorOperation, deleteFactorOperation } from '../operations';

export const useFactorCrud = (
  factors: Factor[],
  setFactors: (factors: Factor[]) => void,
  measurements: Measurement[],
  setMeasurements: (measurements: Measurement[]) => void
) => {
  const createFactor = (factor: Omit<Factor, 'id' | 'createdAt' | 'updatedAt'>) => {
    createFactorOperation(factors, setFactors, factor);
  };

  const updateFactor = (id: string, factor: Partial<Factor>) => {
    updateFactorOperation(factors, setFactors, measurements, setMeasurements, id, factor);
  };

  const deleteFactor = (id: string) => {
    deleteFactorOperation(factors, setFactors, measurements, setMeasurements, id);
  };

  return {
    createFactor,
    updateFactor,
    deleteFactor
  };
};
