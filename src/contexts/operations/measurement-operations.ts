
import { toast } from 'sonner';
import { Measurement, Factor, MeasurementStatus } from '@/types';
import { generateId, getCurrentTimestamp } from '../utils';

export const createMeasurementOperation = (
  factors: Factor[],
  measurements: Measurement[],
  setMeasurements: (measurements: Measurement[]) => void,
  measurement: Omit<Measurement, 'id' | 'createdAt' | 'updatedAt' | 'calculatedValue' | 'unit'>
) => {
  const factor = factors.find(f => f.id === measurement.factorId);
  if (!factor) {
    toast.error('Factor not found');
    return;
  }

  const trackId = factor.trackId;
  if (!trackId) {
    toast.error('Factor must be associated with a track');
    return;
  }

  const newMeasurement: Measurement = {
    ...measurement,
    trackId,
    id: generateId('measurement'),
    calculatedValue: measurement.quantity * factor.value,
    unit: factor.unit,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  };
  setMeasurements([...measurements, newMeasurement]);
  toast.success('Created measurement');
};

export const updateMeasurementOperation = (
  measurements: Measurement[],
  setMeasurements: (measurements: Measurement[]) => void,
  factors: Factor[],
  id: string,
  measurement: Partial<Measurement>
) => {
  setMeasurements(measurements.map(m => {
    if (m.id === id) {
      const factor = factors.find(f => f.id === (measurement.factorId || m.factorId));
      if (!factor) return m;
      
      const trackId = measurement.factorId ? factor.trackId : m.trackId;
      
      return {
        ...m,
        ...measurement,
        trackId,
        calculatedValue: (measurement.quantity || m.quantity) * factor.value,
        updatedAt: getCurrentTimestamp()
      };
    }
    return m;
  }));
  toast.success('Updated measurement');
};

export const deleteMeasurementOperation = (
  measurements: Measurement[],
  setMeasurements: (measurements: Measurement[]) => void,
  id: string
) => {
  setMeasurements(measurements.filter(m => m.id !== id));
  toast.success('Deleted measurement');
};
