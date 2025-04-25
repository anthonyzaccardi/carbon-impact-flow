import { toast } from 'sonner';
import { generateId, getCurrentTimestamp } from './utils';
import { 
  Track, Factor, Measurement, Target, 
  Initiative, Scenario, Supplier 
} from '../types';
import { Dispatch, SetStateAction } from 'react';

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

export const createFactorOperation = (
  factors: Factor[],
  setFactors: (factors: Factor[]) => void,
  measurements: Measurement[],
  setMeasurements: (measurements: Measurement[]) => void,
  factor: Omit<Factor, 'id' | 'createdAt' | 'updatedAt'>
) => {
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

export const createMeasurementOperation = (
  measurements: Measurement[],
  setMeasurements: (measurements: Measurement[]) => void,
  factors: Factor[],
  measurement: Omit<Measurement, 'id' | 'createdAt' | 'updatedAt' | 'calculatedValue'>
) => {
  const factor = factors.find(f => f.factorId === measurement.factorId);
  if (!factor) {
    toast.error('Factor not found');
    return;
  }

  const newMeasurement: Measurement = {
    ...measurement,
    id: generateId('measurement'),
    calculatedValue: measurement.quantity * factor.value,
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
      
      const updatedMeasurement = {
        ...m,
        ...measurement,
        calculatedValue: (measurement.quantity || m.quantity) * factor.value,
        updatedAt: getCurrentTimestamp()
      };
      return updatedMeasurement;
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

export const createTargetOperation = (
  targets: Target[],
  setTargets: (targets: Target[]) => void,
  target: Omit<Target, 'id' | 'createdAt' | 'updatedAt' | 'targetValue'>
) => {
  const targetValue = target.baselineValue * (1 - (target.targetPercentage / 100));
  const newTarget: Target = {
    ...target,
    targetValue,
    id: generateId('target'),
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  };
  setTargets([...targets, newTarget]);
  toast.success(`Created target: ${target.name}`);
};

export const updateTargetOperation = (
  targets: Target[],
  setTargets: (targets: Target[]) => void,
  id: string,
  target: Partial<Target>
) => {
  setTargets(targets.map(t => {
    if (t.id === id) {
      const targetValue = target.baselineValue !== undefined && target.targetPercentage !== undefined
        ? target.baselineValue * (1 - (target.targetPercentage / 100))
        : target.targetValue !== undefined 
          ? target.targetValue 
          : t.targetValue;
      
      return { 
        ...t, 
        ...target, 
        targetValue,
        updatedAt: getCurrentTimestamp() 
      };
    }
    return t;
  }));
  toast.success(`Updated target: ${target.name || id}`);
};

export const deleteTargetOperation = (
  targets: Target[],
  setTargets: (targets: Target[]) => void,
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  id: string
) => {
  const updatedInitiatives = initiatives.map(initiative => ({
    ...initiative,
    targetIds: initiative.targetIds.filter(targetId => targetId !== id)
  }));
  setInitiatives(updatedInitiatives);
  
  setTargets(targets.filter(t => t.id !== id));
  toast.success(`Deleted target: ${id}`);
};

export const createInitiativeOperation = (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  targets: Target[],
  extractPercentage: (plan: string) => number,
  initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt' | 'absolute' | 'targetIds'> & { targetIds?: string[] }
) => {
  const absolute = calculateInitiativeAbsoluteValue(
    { ...initiative, targetIds: initiative.targetIds || [] },
    targets,
    extractPercentage
  );

  const newInitiative: Initiative = {
    ...initiative,
    targetIds: initiative.targetIds || [],
    absolute,
    id: generateId('initiative'),
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  };
  setInitiatives([...initiatives, newInitiative]);
  toast.success(`Created initiative: ${initiative.name}`);
};

export const updateInitiativeOperation = (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  targets: Target[],
  extractPercentage: (plan: string) => number,
  id: string,
  initiative: Partial<Initiative>
) => {
  setInitiatives(initiatives.map(i => {
    if (i.id === id) {
      const updatedInitiative = { ...i, ...initiative };
      const absolute = calculateInitiativeAbsoluteValue(
        updatedInitiative,
        targets,
        extractPercentage
      );
      return { ...updatedInitiative, absolute, updatedAt: getCurrentTimestamp() };
    }
    return i;
  }));
  toast.success(`Updated initiative: ${initiative.name || id}`);
};

export const deleteInitiativeOperation = (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  id: string
) => {
  setInitiatives(initiatives.filter(i => i.id !== id));
  toast.success(`Deleted initiative: ${id}`);
};

export const addTargetsToInitiativeOperation = (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  initiativeId: string,
  targetIds: string[]
) => {
  setInitiatives(initiatives.map(i => {
    if (i.id === initiativeId) {
      const newTargetIds = [...new Set([...i.targetIds, ...targetIds])];
      return { ...i, targetIds: newTargetIds, updatedAt: getCurrentTimestamp() };
    }
    return i;
  }));
  toast.success('Added targets to initiative');
};

export const removeTargetFromInitiativeOperation = (
  initiatives: Initiative[],
  setInitiatives: (initiatives: Initiative[]) => void,
  initiativeId: string,
  targetId: string
) => {
  setInitiatives(initiatives.map(i => {
    if (i.id === initiativeId) {
      return {
        ...i,
        targetIds: i.targetIds.filter(id => id !== targetId),
        updatedAt: getCurrentTimestamp()
      };
    }
    return i;
  }));
  toast.success('Removed target from initiative');
};

export const createScenarioOperation = (
  scenarios: Scenario[],
  setScenarios: (scenarios: Scenario[]) => void,
  targets: Target[],
  setTargets: (targets: Target[]) => void,
  scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const newScenario: Scenario = {
    ...scenario,
    id: generateId('scenario'),
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  };
  setScenarios([...scenarios, newScenario]);
  toast.success(`Created scenario: ${scenario.name}`);
};

export const updateScenarioOperation = (
  scenarios: Scenario[],
  setScenarios: (scenarios: Scenario[]) => void,
  id: string,
  scenario: Partial<Scenario>
) => {
  setScenarios(scenarios.map(s =>
    s.id === id ? { ...s, ...scenario, updatedAt: getCurrentTimestamp() } : s
  ));
  toast.success(`Updated scenario: ${scenario.name || id}`);
};

export const deleteScenarioOperation = (
  scenarios: Scenario[],
  setScenarios: (scenarios: Scenario[]) => void,
  targets: Target[],
  setTargets: (targets: Target[]) => void,
  id: string
) => {
  const updatedTargets = targets.map(target => 
    target.scenarioId === id ? { ...target, scenarioId: undefined } : target
  );
  setTargets(updatedTargets);
  
  setScenarios(scenarios.filter(s => s.id !== id));
  toast.success(`Deleted scenario: ${id}`);
};

export const createSupplierOperation = (
  suppliers: Supplier[],
  setSuppliers: (suppliers: Supplier[]) => void,
  supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const newSupplier: Supplier = {
    ...supplier,
    id: generateId('supplier'),
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  };
  setSuppliers([...suppliers, newSupplier]);
  toast.success(`Created supplier: ${supplier.name}`);
};

export const updateSupplierOperation = (
  suppliers: Supplier[],
  setSuppliers: (suppliers: Supplier[]) => void,
  id: string,
  supplier: Partial<Supplier>
) => {
  setSuppliers(suppliers.map(s =>
    s.id === id ? { ...s, ...supplier, updatedAt: getCurrentTimestamp() } : s
  ));
  toast.success(`Updated supplier: ${supplier.name || id}`);
};

export const deleteSupplierOperation = (
  suppliers: Supplier[],
  setSuppliers: Dispatch<SetStateAction<Supplier[]>>,
  id: string
) => {
  try {
    const updatedSuppliers = suppliers.filter(supplier => supplier.id !== id);
    setSuppliers(updatedSuppliers);
    toast.success('Supplier deleted successfully');
  } catch (error) {
    toast.error('Failed to delete supplier');
    console.error('Error deleting supplier:', error);
  }
};
