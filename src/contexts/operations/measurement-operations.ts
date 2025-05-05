
import { toast } from 'sonner';
import { Measurement, Factor, MeasurementStatus } from '@/types';
import { generateId, getCurrentTimestamp } from '../utils';
import { 
  createMeasurement as createMeasurementInSupabase,
  updateMeasurement as updateMeasurementInSupabase, 
  deleteMeasurement as deleteMeasurementInSupabase
} from '@/services/supabase/measurementService';

export const createMeasurementOperation = async (
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

  try {
    // Calculate value using the factor
    const calculatedValue = measurement.quantity * factor.value;
    
    // Create in Supabase
    const newMeasurement = await createMeasurementInSupabase({
      ...measurement,
      trackId,
      calculatedValue,
      unit: factor.unit
    });
    
    if (newMeasurement) {
      // Update local state
      setMeasurements([...measurements, newMeasurement]);
      toast.success('Created measurement');
    }
  } catch (error) {
    console.error('Error in createMeasurementOperation:', error);
    toast.error('Failed to create measurement');
  }
};

export const updateMeasurementOperation = async (
  measurements: Measurement[],
  setMeasurements: (measurements: Measurement[]) => void,
  factors: Factor[],
  id: string,
  measurement: Partial<Measurement>
) => {
  try {
    // Get factor for calculation (either new or existing)
    const factorId = measurement.factorId || measurements.find(m => m.id === id)?.factorId;
    const factor = factors.find(f => f.id === factorId);
    
    if (!factor) {
      toast.error('Factor not found');
      return;
    }
    
    // Calculate new track ID if factor changed
    const trackId = measurement.factorId ? factor.trackId : undefined;
    
    // Calculate new value if quantity changed
    let calculatedValue;
    if (measurement.quantity !== undefined) {
      calculatedValue = measurement.quantity * factor.value;
    }
    
    // Update in Supabase
    const updatedMeasurement = await updateMeasurementInSupabase(id, {
      ...measurement,
      ...(trackId && { trackId }),
      ...(calculatedValue !== undefined && { calculatedValue }),
      unit: factor.unit
    });
    
    if (updatedMeasurement) {
      // Update local state
      setMeasurements(measurements.map(m => m.id === id ? updatedMeasurement : m));
      toast.success('Updated measurement');
    }
  } catch (error) {
    console.error('Error in updateMeasurementOperation:', error);
    toast.error('Failed to update measurement');
  }
};

export const deleteMeasurementOperation = async (
  measurements: Measurement[],
  setMeasurements: (measurements: Measurement[]) => void,
  id: string
) => {
  try {
    // Delete from Supabase
    const success = await deleteMeasurementInSupabase(id);
    
    if (success) {
      // Update local state
      setMeasurements(measurements.filter(m => m.id !== id));
      toast.success('Deleted measurement');
    }
  } catch (error) {
    console.error('Error in deleteMeasurementOperation:', error);
    toast.error('Failed to delete measurement');
  }
};
