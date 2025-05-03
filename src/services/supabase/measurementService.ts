
import { supabase } from "@/integrations/supabase/client";
import { Measurement } from "@/types";
import { toast } from "sonner";

export async function fetchMeasurements(): Promise<Measurement[]> {
  const { data, error } = await supabase
    .from('measurements')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching measurements:', error);
    toast.error('Failed to load measurements');
    return [];
  }

  return data ? data.map(m => ({
    id: m.id,
    trackId: m.track_id,
    factorId: m.factor_id,
    supplierId: m.supplier_id,
    date: m.date,
    quantity: m.quantity,
    unit: m.unit,
    calculatedValue: m.calculated_value,
    status: m.status,
    notes: m.notes,
    createdAt: m.created_at,
    updatedAt: m.updated_at
  })) : [];
}

export async function createMeasurement(measurement: Omit<Measurement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Measurement | null> {
  const newMeasurement = {
    track_id: measurement.trackId,
    factor_id: measurement.factorId,
    supplier_id: measurement.supplierId,
    date: measurement.date,
    quantity: measurement.quantity,
    unit: measurement.unit,
    calculated_value: measurement.calculatedValue,
    status: measurement.status,
    notes: measurement.notes
  };

  const { data, error } = await supabase
    .from('measurements')
    .insert([newMeasurement])
    .select()
    .single();

  if (error) {
    console.error('Error creating measurement:', error);
    toast.error(`Failed to create measurement: ${error.message}`);
    return null;
  }

  return {
    id: data.id,
    trackId: data.track_id,
    factorId: data.factor_id,
    supplierId: data.supplier_id,
    date: data.date,
    quantity: data.quantity,
    unit: data.unit,
    calculatedValue: data.calculated_value,
    status: data.status,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function updateMeasurement(id: string, measurement: Partial<Measurement>): Promise<Measurement | null> {
  const updates = {
    ...(measurement.trackId && { track_id: measurement.trackId }),
    ...(measurement.factorId && { factor_id: measurement.factorId }),
    ...(measurement.supplierId && { supplier_id: measurement.supplierId }),
    ...(measurement.date && { date: measurement.date }),
    ...(measurement.quantity !== undefined && { quantity: measurement.quantity }),
    ...(measurement.unit && { unit: measurement.unit }),
    ...(measurement.calculatedValue !== undefined && { calculated_value: measurement.calculatedValue }),
    ...(measurement.status && { status: measurement.status }),
    ...(measurement.notes !== undefined && { notes: measurement.notes })
  };

  const { data, error } = await supabase
    .from('measurements')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating measurement:', error);
    toast.error(`Failed to update measurement: ${error.message}`);
    return null;
  }

  return {
    id: data.id,
    trackId: data.track_id,
    factorId: data.factor_id,
    supplierId: data.supplier_id,
    date: data.date,
    quantity: data.quantity,
    unit: data.unit,
    calculatedValue: data.calculated_value,
    status: data.status,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function deleteMeasurement(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('measurements')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting measurement:', error);
    toast.error(`Failed to delete measurement: ${error.message}`);
    return false;
  }

  return true;
}
