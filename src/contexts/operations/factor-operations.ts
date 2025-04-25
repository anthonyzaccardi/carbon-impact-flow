
import { toast } from 'sonner';
import { Factor, Measurement } from '@/types';
import { generateId, getCurrentTimestamp } from '../utils';

export const createFactorOperation = (
  factors: Factor[],
  setFactors: (factors: Factor[]) => void,
  factor: Omit<Factor, 'id' | 'createdAt' | 'updatedAt'>
) => {
  if (!factor.trackId) {
    toast.error('Factor must be associated with a track');
    return;
  }

  const newFactor: Factor = {
    ...factor,
    id: generateId('factor'),
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  };
  setFactors([...factors, newFactor]);
  toast.success(`Created factor: ${factor.name}`);
};

export const updateFactorOperation = (
  factors: Factor[],
  setFactors: (factors: Factor[]) => void,
  measurements: Measurement[],
  setMeasurements: (measurements: Measurement[]) => void,
  id: string,
  factor: Partial<Factor>
) => {
  if (factor.trackId === undefined) {
    const existingFactor = factors.find(f => f.id === id);
    if (existingFactor) {
      factor.trackId = existingFactor.trackId;
    }
  }

  setFactors(factors.map(f => 
    f.id === id ? { ...f, ...factor, updatedAt: getCurrentTimestamp() } : f
  ));

  if (factor.value !== undefined || factor.unit !== undefined) {
    const updatedMeasurements = measurements.map(m => {
      if (m.factorId === id) {
        const updatedFactor = factors.find(f => f.id === id);
        if (updatedFactor) {
          return {
            ...m,
            unit: updatedFactor.unit,
            calculatedValue: m.quantity * updatedFactor.value,
            updatedAt: getCurrentTimestamp()
          };
        }
      }
      return m;
    });
    setMeasurements(updatedMeasurements);
  }
  
  toast.success(`Updated factor: ${factor.name || id}`);
};

export const deleteFactorOperation = (
  factors: Factor[],
  setFactors: (factors: Factor[]) => void,
  measurements: Measurement[],
  setMeasurements: (measurements: Measurement[]) => void,
  id: string
) => {
  const hasMeasurements = measurements.some(m => m.factorId === id);
  
  if (hasMeasurements) {
    toast.error(`Cannot delete factor: it's in use by measurements`);
    return;
  }
  
  setFactors(factors.filter(f => f.id !== id));
  toast.success(`Deleted factor: ${id}`);
};
