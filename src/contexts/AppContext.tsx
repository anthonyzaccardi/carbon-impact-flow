
import { createContext, useState, useEffect, ReactNode } from 'react';
import { AppContextType } from './types';
import { Track, Factor, Measurement, Target, Initiative, Scenario, Supplier, InitiativeStatus, TrajectoryType, PlanType } from '../types';
import { createTrackOperation, updateTrackOperation, deleteTrackOperation, createFactorOperation, updateFactorOperation, deleteFactorOperation, createMeasurementOperation, updateMeasurementOperation, deleteMeasurementOperation, createTargetOperation, updateTargetOperation, deleteTargetOperation, createInitiativeOperation, updateInitiativeOperation, deleteInitiativeOperation, addTargetsToInitiativeOperation, removeTargetFromInitiativeOperation, createScenarioOperation, updateScenarioOperation, deleteScenarioOperation, createSupplierOperation, updateSupplierOperation, deleteSupplierOperation } from './operations';
import { calculateInitiativeAbsoluteValue, generateId, getCurrentTimestamp } from './utils';
import { toast } from 'sonner';
import {
  tracks as initialTracks,
  factors as initialFactors,
  measurements as initialMeasurements,
  targets as initialTargets,
  initiatives as initialInitiatives,
  scenarios as initialScenarios,
  suppliers as initialSuppliers
} from '../data/sample-data';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Data state
  const [tracks, setTracks] = useState<Track[]>(initialTracks.map(track => ({
    ...track,
    totalEmissions: 0
  })));
  const [factors, setFactors] = useState<Factor[]>(initialFactors);
  const [measurements, setMeasurements] = useState<Measurement[]>(initialMeasurements);
  const [targets, setTargets] = useState<Target[]>(initialTargets);
  const [initiatives, setInitiatives] = useState<Initiative[]>(initialInitiatives);
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  
  // UI state
  const [sidePanel, setSidePanel] = useState({
    isOpen: false,
    type: 'view' as 'view' | 'create' | 'edit',
    entityType: 'track' as 'track' | 'factor' | 'measurement' | 'target' | 'initiative' | 'scenario' | 'supplier'
  });
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  // UI actions
  const openSidePanel = (type: 'create' | 'edit' | 'view', entityType: AppContextType['sidePanel']['entityType'], data?: any) => {
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
  
  // CRUD operations
  const createTrack = (track: Omit<Track, 'id' | 'createdAt' | 'updatedAt' | 'totalEmissions'>) => {
    createTrackOperation(tracks, setTracks, track);
  };
  
  const updateTrack = (id: string, track: Partial<Track>) => {
    updateTrackOperation(tracks, setTracks, id, track);
  };
  
  const deleteTrack = (id: string) => {
    deleteTrackOperation(tracks, factors, measurements, targets, setTracks, id);
  };

  const createFactor = (factor: Omit<Factor, 'id' | 'createdAt' | 'updatedAt'>) => {
    createFactorOperation(factors, setFactors, measurements, setMeasurements, factor);
  };

  const updateFactor = (id: string, factor: Partial<Factor>) => {
    updateFactorOperation(factors, setFactors, measurements, setMeasurements, id, factor);
  };

  const deleteFactor = (id: string) => {
    deleteFactorOperation(factors, setFactors, measurements, setMeasurements, id);
  };

  const createMeasurement = (measurement: Omit<Measurement, 'id' | 'createdAt' | 'updatedAt' | 'calculatedValue' | 'unit'>) => {
    createMeasurementOperation(factors, measurements, setMeasurements, measurement);
  };

  const updateMeasurement = (id: string, measurement: Partial<Measurement>) => {
    updateMeasurementOperation(measurements, setMeasurements, factors, id, measurement);
  };

  const deleteMeasurement = (id: string) => {
    deleteMeasurementOperation(measurements, setMeasurements, id);
  };

  const createTarget = (target: Omit<Target, 'id' | 'createdAt' | 'updatedAt' | 'targetValue'>) => {
    createTargetOperation(targets, setTargets, target);
  };

  const updateTarget = (id: string, target: Partial<Target>) => {
    updateTargetOperation(targets, setTargets, id, target);
  };

  const deleteTarget = (id: string) => {
    deleteTargetOperation(targets, setTargets, initiatives, setInitiatives, id);
  };

  const createInitiative = (initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt' | 'absolute' | 'targetIds'> & { targetIds?: string[] }) => {
    createInitiativeOperation(initiatives, setInitiatives, targets, extractPercentage, initiative);
  };

  const updateInitiative = (id: string, initiative: Partial<Initiative>) => {
    updateInitiativeOperation(initiatives, setInitiatives, targets, extractPercentage, id, initiative);
  };

  const deleteInitiative = (id: string) => {
    deleteInitiativeOperation(initiatives, setInitiatives, id);
  };

  const addTargetsToInitiative = (initiativeId: string, targetIds: string[]) => {
    addTargetsToInitiativeOperation(initiatives, setInitiatives, initiativeId, targetIds);
  };

  const removeTargetFromInitiative = (initiativeId: string, targetId: string) => {
    removeTargetFromInitiativeOperation(initiatives, setInitiatives, initiativeId, targetId);
  };

  const getInitiativesByTargetId = (targetId: string): Initiative[] => {
    return initiatives.filter(initiative => initiative.targetIds.includes(targetId));
  };

  const createScenario = (scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>) => {
    createScenarioOperation(scenarios, setScenarios, targets, setTargets, scenario);
  };

  const updateScenario = (id: string, scenario: Partial<Scenario>) => {
    updateScenarioOperation(scenarios, setScenarios, id, scenario);
  };

  const deleteScenario = (id: string) => {
    deleteScenarioOperation(scenarios, setScenarios, targets, setTargets, id);
  };

  const createSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    createSupplierOperation(suppliers, setSuppliers, supplier);
  };

  const updateSupplier = (id: string, supplier: Partial<Supplier>) => {
    updateSupplierOperation(suppliers, setSuppliers, id, supplier);
  };

  const deleteSupplier = (id: string) => {
    deleteSupplierOperation(suppliers, setSuppliers, measurements, targets, setSuppliers, id);
  };
  
  // Effects for automatic calculations
  useEffect(() => {
    const updatedTracks = tracks.map(track => ({
      ...track,
      totalEmissions: calculateTrackMeasurementsValue(track.id)
    }));
    
    if (JSON.stringify(updatedTracks) !== JSON.stringify(tracks)) {
      setTracks(updatedTracks);
    }
  }, [measurements]);
  
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
  
  useEffect(() => {
    const updatedInitiatives = initiatives.map(initiative => {
      const absolute = calculateInitiativeAbsoluteValue(
        initiative,
        targets,
        extractPercentage
      );
      return { ...initiative, absolute };
    });
    
    if (JSON.stringify(updatedInitiatives) !== JSON.stringify(initiatives)) {
      setInitiatives(updatedInitiatives);
    }
  }, [targets, initiatives]);
  
  const value: AppContextType = {
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
