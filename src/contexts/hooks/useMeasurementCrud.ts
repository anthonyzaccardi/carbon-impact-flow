
import { Factor, Measurement } from '@/types';
import { createMeasurementOperation, updateMeasurementOperation, deleteMeasurementOperation } from '../operations';

export const useMeasurementCrud = (
  factors: Factor[],
  measurements: Measurement[],
  setMeasurements: (measurements: Measurement[]) => void
) => {
  const createMeasurement = (measurement: Omit<Measurement, 'id' | 'createdAt' | 'updatedAt' | 'calculatedValue' | 'unit'>) => {
    createMeasurementOperation(factors, measurements, setMeasurements, measurement);
  };

  const updateMeasurement = (id: string, measurement: Partial<Measurement>) => {
    updateMeasurementOperation(measurements, setMeasurements, factors, id, measurement);
  };

  const deleteMeasurement = (id: string) => {
    deleteMeasurementOperation(measurements, setMeasurements, id);
  };

  return {
    createMeasurement,
    updateMeasurement,
    deleteMeasurement
  };
};
