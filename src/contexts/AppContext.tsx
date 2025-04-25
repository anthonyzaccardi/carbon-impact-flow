
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { SidePanel, Track, Factor, Measurement, Target, Initiative, Scenario, Supplier, InitiativeStatus, TrajectoryType, PlanType } from '../types';
import { 
  tracks as initialTracks,
  factors as initialFactors,
  measurements as initialMeasurements,
  targets as initialTargets,
  initiatives as initialInitiatives,
  scenarios as initialScenarios,
  suppliers as initialSuppliers
} from '../data/sample-data';
import { toast } from 'sonner';

interface AppContextType {
  // Data
  tracks: Track[];
  factors: Factor[];
  measurements: Measurement[];
  targets: Target[];
  initiatives: Initiative[];
  scenarios: Scenario[];
  suppliers: Supplier[];
  
  // Side panel state
  sidePanel: SidePanel;
  
  // UI state
  sidebarExpanded: boolean;
  
  // Actions
  openSidePanel: (type: 'create' | 'edit' | 'view', entityType: SidePanel['entityType'], data?: any) => void;
  closeSidePanel: () => void;
  toggleSidebar: () => void;
  
  // CRUD operations
  createTrack: (track: Omit<Track, 'id' | 'createdAt' | 'updatedAt' | 'totalEmissions'>) => void;
  updateTrack: (id: string, track: Partial<Track>) => void;
  deleteTrack: (id: string) => void;
  
  createFactor: (factor: Omit<Factor, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFactor: (id: string, factor: Partial<Factor>) => void;
  deleteFactor: (id: string) => void;
  
  createMeasurement: (measurement: Omit<Measurement, 'id' | 'createdAt' | 'updatedAt' | 'calculatedValue' | 'unit'>) => void;
  updateMeasurement: (id: string, measurement: Partial<Measurement>) => void;
  deleteMeasurement: (id: string) => void;
  
  createTarget: (target: Omit<Target, 'id' | 'createdAt' | 'updatedAt' | 'targetValue'>) => void;
  updateTarget: (id: string, target: Partial<Target>) => void;
  deleteTarget: (id: string) => void;
  
  createInitiative: (initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt' | 'absolute' | 'targetIds'> & { targetIds?: string[] }) => void;
  updateInitiative: (id: string, initiative: Partial<Initiative>) => void;
  deleteInitiative: (id: string) => void;
  addTargetsToInitiative: (initiativeId: string, targetIds: string[]) => void;
  removeTargetFromInitiative: (initiativeId: string, targetId: string) => void;
  getInitiativesByTargetId: (targetId: string) => Initiative[];
  
  createScenario: (scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateScenario: (id: string, scenario: Partial<Scenario>) => void;
  deleteScenario: (id: string) => void;
  
  createSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  // Utility functions
  calculateTrackMeasurementsValue: (trackId: string) => number;
  extractPercentage: (plan: PlanType) => number;
  getFactorUnit: (factorId: string) => string;
  getInitiativesForTarget: (targetId: string) => Initiative[];
  getTrackStats: (trackId: string) => { factorsCount: number; measurementsCount: number; targetsCount: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Data state
  const [tracks, setTracks] = useState<Track[]>(initialTracks.map(track => ({
    ...track,
    totalEmissions: 0 // Set initially to 0, will be calculated in useEffect
  })));
  const [factors, setFactors] = useState<Factor[]>(initialFactors);
  const [measurements, setMeasurements] = useState<Measurement[]>(initialMeasurements);
  const [targets, setTargets] = useState<Target[]>(initialTargets);
  const [initiatives, setInitiatives] = useState<Initiative[]>(initialInitiatives);
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  
  // UI state
  const [sidePanel, setSidePanel] = useState<SidePanel>({
    isOpen: false,
    type: 'view',
    entityType: 'track'
  });
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  // Helper function to generate IDs and timestamps
  const generateId = (prefix: string) => `${prefix}-${Date.now()}`;
  const getCurrentTimestamp = () => new Date().toISOString();
  
  // Side panel actions
  const openSidePanel = (type: 'create' | 'edit' | 'view', entityType: SidePanel['entityType'], data?: any) => {
    setSidePanel({ isOpen: true, type, entityType, data });
  };
  
  const closeSidePanel = () => {
    setSidePanel(prev => ({ ...prev, isOpen: false }));
  };
  
  const toggleSidebar = () => {
    setSidebarExpanded(prev => !prev);
  };
  
  // Utility functions
  const calculateTrackMeasurementsValue = (trackId: string): number => {
    const trackMeasurements = measurements.filter(m => m.trackId === trackId);
    return trackMeasurements.reduce((sum, measurement) => sum + measurement.calculatedValue, 0);
  };
  
  const extractPercentage = (plan: PlanType): number => {
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
  
  // Calculate values for measurements based on factors
  const calculateMeasurementValue = (measurement: Omit<Measurement, 'id' | 'createdAt' | 'updatedAt' | 'calculatedValue' | 'unit'>) => {
    const factor = factors.find(f => f.id === measurement.factorId);
    if (!factor) return 0;
    return measurement.quantity * factor.value;
  };
  
  // Calculate values for initiatives based on targets
  const calculateInitiativeAbsoluteValue = (initiative: Initiative): number => {
    const initiativeTargets = targets.filter(t => initiative.targetIds.includes(t.id));
    let absolute = 0;
    
    if (initiativeTargets.length > 0) {
      absolute = initiativeTargets.reduce((sum, target) => {
        if (target.trackId) {
          return sum + (target.targetValue * Math.abs(extractPercentage(initiative.plan)));
        }
        return sum;
      }, 0);
    }
    
    return absolute;
  };
  
  // Update track total emissions based on measurements
  useEffect(() => {
    const updatedTracks = tracks.map(track => {
      const totalEmissions = calculateTrackMeasurementsValue(track.id);
      return { ...track, totalEmissions };
    });
    
    if (JSON.stringify(updatedTracks) !== JSON.stringify(tracks)) {
      setTracks(updatedTracks);
    }
  }, [measurements]);
  
  // Update target values based on percentage
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
  }, [targets]);
  
  // Update absolute values when related data changes
  useEffect(() => {
    const updatedInitiatives = initiatives.map(initiative => {
      const absolute = calculateInitiativeAbsoluteValue(initiative);
      return { ...initiative, absolute };
    });
    
    if (JSON.stringify(updatedInitiatives) !== JSON.stringify(initiatives)) {
      setInitiatives(updatedInitiatives);
    }
  }, [targets, initiatives]);
  
  // CRUD operations for tracks
  const createTrack = (track: Omit<Track, 'id' | 'createdAt' | 'updatedAt' | 'totalEmissions'>) => {
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
  
  const updateTrack = (id: string, track: Partial<Track>) => {
    setTracks(tracks.map(t => 
      t.id === id ? { ...t, ...track, updatedAt: getCurrentTimestamp() } : t
    ));
    toast.success(`Updated track: ${track.name || id}`);
  };
  
  const deleteTrack = (id: string) => {
    // Check for dependencies first
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
  
  // CRUD operations for factors
  const createFactor = (factor: Omit<Factor, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newFactor: Factor = {
      ...factor,
      id: generateId('factor'),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    setFactors([...factors, newFactor]);
    toast.success(`Created factor: ${factor.name}`);
  };
  
  const updateFactor = (id: string, factor: Partial<Factor>) => {
    setFactors(factors.map(f => 
      f.id === id ? { ...f, ...factor, updatedAt: getCurrentTimestamp() } : f
    ));
    toast.success(`Updated factor: ${factor.name || id}`);
  };
  
  const deleteFactor = (id: string) => {
    // Check if factor is in use by measurements
    const hasMeasurements = measurements.some(m => m.factorId === id);
    
    if (hasMeasurements) {
      toast.error(`Cannot delete factor: it's in use by measurements`);
      return;
    }
    
    setFactors(factors.filter(f => f.id !== id));
    toast.success(`Deleted factor: ${id}`);
  };
  
  // CRUD operations for measurements
  const createMeasurement = (measurement: Omit<Measurement, 'id' | 'createdAt' | 'updatedAt' | 'calculatedValue' | 'unit'>) => {
    const factor = factors.find(f => f.id === measurement.factorId);
    if (!factor) {
      toast.error(`Factor not found`);
      return;
    }
    
    const calculatedValue = calculateMeasurementValue(measurement);
    
    const newMeasurement: Measurement = {
      ...measurement,
      unit: factor.unit,
      calculatedValue,
      id: generateId('measurement'),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    
    setMeasurements([...measurements, newMeasurement]);
    toast.success(`Created measurement with value: ${calculatedValue} ${factor.unit}`);
  };
  
  const updateMeasurement = (id: string, measurement: Partial<Measurement>) => {
    let updatedMeasurement: Partial<Measurement> = { ...measurement };
    
    // If quantity or factorId changed, recalculate the value
    if (measurement.quantity !== undefined || measurement.factorId !== undefined) {
      const currentMeasurement = measurements.find(m => m.id === id);
      if (currentMeasurement) {
        const newMeasurement = {
          ...currentMeasurement,
          ...measurement
        };
        
        // If factor changed, update unit
        if (measurement.factorId) {
          const factor = factors.find(f => f.id === measurement.factorId);
          if (factor) {
            updatedMeasurement.unit = factor.unit;
          }
        }
        
        updatedMeasurement.calculatedValue = calculateMeasurementValue({
          trackId: newMeasurement.trackId,
          factorId: newMeasurement.factorId,
          date: newMeasurement.date,
          quantity: newMeasurement.quantity,
          supplierId: newMeasurement.supplierId
        });
      }
    }
    
    setMeasurements(measurements.map(m => 
      m.id === id ? { ...m, ...updatedMeasurement, updatedAt: getCurrentTimestamp() } : m
    ));
    
    toast.success(`Updated measurement: ${id}`);
  };
  
  const deleteMeasurement = (id: string) => {
    setMeasurements(measurements.filter(m => m.id !== id));
    toast.success(`Deleted measurement: ${id}`);
  };
  
  // CRUD operations for targets
  const createTarget = (target: Omit<Target, 'id' | 'createdAt' | 'updatedAt' | 'targetValue'>) => {
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
  
  const updateTarget = (id: string, target: Partial<Target>) => {
    // Auto-calculate targetValue if baselineValue or targetPercentage is updated
    if (target.baselineValue !== undefined || target.targetPercentage !== undefined) {
      const currentTarget = targets.find(t => t.id === id);
      if (currentTarget) {
        const baselineValue = target.baselineValue !== undefined ? target.baselineValue : currentTarget.baselineValue;
        const targetPercentage = target.targetPercentage !== undefined ? target.targetPercentage : currentTarget.targetPercentage;
        target.targetValue = baselineValue * (1 - (targetPercentage / 100));
      }
    }
    
    setTargets(targets.map(t => 
      t.id === id ? { ...t, ...target, updatedAt: getCurrentTimestamp() } : t
    ));
    
    toast.success(`Updated target: ${target.name || id}`);
  };
  
  const deleteTarget = (id: string) => {
    // Check if target is used in initiatives
    const usedInInitiatives = initiatives.some(i => i.targetIds.includes(id));
    
    if (usedInInitiatives) {
      toast.error(`Cannot delete target: it's used in initiatives`);
      return;
    }
    
    setTargets(targets.filter(t => t.id !== id));
    toast.success(`Deleted target: ${id}`);
  };
  
  // CRUD operations for initiatives
  const createInitiative = (initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt' | 'absolute' | 'targetIds'> & { targetIds?: string[] }) => {
    const targetIds = initiative.targetIds || [];
    
    const newInitiative: Initiative = {
      ...initiative,
      targetIds,
      absolute: 0, // Will be calculated in useEffect
      id: generateId('initiative'),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    
    const updatedInitiatives = [...initiatives, newInitiative];
    setInitiatives(updatedInitiatives);
    toast.success(`Created initiative: ${initiative.name}`);
  };
  
  const updateInitiative = (id: string, initiative: Partial<Initiative>) => {
    setInitiatives(initiatives.map(i => 
      i.id === id ? { ...i, ...initiative, updatedAt: getCurrentTimestamp() } : i
    ));
    toast.success(`Updated initiative: ${initiative.name || id}`);
  };
  
  const deleteInitiative = (id: string) => {
    setInitiatives(initiatives.filter(i => i.id !== id));
    toast.success(`Deleted initiative: ${id}`);
  };
  
  const addTargetsToInitiative = (initiativeId: string, targetIds: string[]) => {
    const initiative = initiatives.find(i => i.id === initiativeId);
    
    if (initiative) {
      const updatedTargetIds = [...new Set([...initiative.targetIds, ...targetIds])];
      
      setInitiatives(initiatives.map(i => 
        i.id === initiativeId ? { ...i, targetIds: updatedTargetIds, updatedAt: getCurrentTimestamp() } : i
      ));
      
      toast.success(`Added ${targetIds.length} targets to initiative: ${initiative.name}`);
    }
  };
  
  const removeTargetFromInitiative = (initiativeId: string, targetId: string) => {
    const initiative = initiatives.find(i => i.id === initiativeId);
    
    if (initiative) {
      const updatedTargetIds = initiative.targetIds.filter(id => id !== targetId);
      
      setInitiatives(initiatives.map(i => 
        i.id === initiativeId ? { ...i, targetIds: updatedTargetIds, updatedAt: getCurrentTimestamp() } : i
      ));
      
      toast.success(`Removed target from initiative: ${initiative.name}`);
    }
  };
  
  const getInitiativesByTargetId = (targetId: string): Initiative[] => {
    return initiatives.filter(initiative => initiative.targetIds.includes(targetId));
  };
  
  // CRUD operations for scenarios
  const createScenario = (scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newScenario: Scenario = {
      ...scenario,
      id: generateId('scenario'),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    
    setScenarios([...scenarios, newScenario]);
    toast.success(`Created scenario: ${scenario.name}`);
  };
  
  const updateScenario = (id: string, scenario: Partial<Scenario>) => {
    setScenarios(scenarios.map(s => 
      s.id === id ? { ...s, ...scenario, updatedAt: getCurrentTimestamp() } : s
    ));
    toast.success(`Updated scenario: ${scenario.name || id}`);
  };
  
  const deleteScenario = (id: string) => {
    // Check if scenario is used in targets
    const hasTargets = targets.some(t => t.scenarioId === id);
    
    if (hasTargets) {
      toast.error(`Cannot delete scenario: it's used in targets`);
      return;
    }
    
    setScenarios(scenarios.filter(s => s.id !== id));
    toast.success(`Deleted scenario: ${id}`);
  };
  
  // CRUD operations for suppliers
  const createSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: generateId('supplier'),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    
    setSuppliers([...suppliers, newSupplier]);
    toast.success(`Created supplier: ${supplier.name}`);
  };
  
  const updateSupplier = (id: string, supplier: Partial<Supplier>) => {
    setSuppliers(suppliers.map(s => 
      s.id === id ? { ...s, ...supplier, updatedAt: getCurrentTimestamp() } : s
    ));
    toast.success(`Updated supplier: ${supplier.name || id}`);
  };
  
  const deleteSupplier = (id: string) => {
    // Check if supplier is used in measurements or targets
    const usedInMeasurements = measurements.some(m => m.supplierId === id);
    const usedInTargets = targets.some(t => t.supplierId === id);
    
    if (usedInMeasurements || usedInTargets) {
      toast.error(`Cannot delete supplier: it's used in measurements or targets`);
      return;
    }
    
    setSuppliers(suppliers.filter(s => s.id !== id));
    toast.success(`Deleted supplier: ${id}`);
  };
  
  const value = {
    // Data
    tracks,
    factors,
    measurements,
    targets,
    initiatives,
    scenarios,
    suppliers,
    
    // UI state
    sidePanel,
    sidebarExpanded,
    
    // Actions
    openSidePanel,
    closeSidePanel,
    toggleSidebar,
    
    // CRUD operations
    createTrack,
    updateTrack,
    deleteTrack,
    createFactor,
    updateFactor,
    deleteFactor,
    createMeasurement,
    updateMeasurement,
    deleteMeasurement,
    createTarget,
    updateTarget,
    deleteTarget,
    createInitiative,
    updateInitiative,
    deleteInitiative,
    addTargetsToInitiative,
    removeTargetFromInitiative,
    getInitiativesByTargetId,
    createScenario,
    updateScenario,
    deleteScenario,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    
    // Utility functions
    calculateTrackMeasurementsValue,
    extractPercentage,
    getFactorUnit,
    getInitiativesForTarget,
    getTrackStats
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
