
import { createContext, useEffect, ReactNode } from 'react';
import { AppContextType } from './types';
import { useEntityState } from './hooks/useEntityState';
import { useUIState } from './hooks/useUIState';
import { useUtilityFunctions } from './hooks/useUtilityFunctions';
import {
  createTrackOperation,
  updateTrackOperation,
  deleteTrackOperation,
  createFactorOperation,
  updateFactorOperation,
  deleteFactorOperation,
  createMeasurementOperation,
  updateMeasurementOperation,
  deleteMeasurementOperation,
  createTargetOperation,
  updateTargetOperation,
  deleteTargetOperation,
  createInitiativeOperation,
  updateInitiativeOperation,
  deleteInitiativeOperation,
  addTargetsToInitiativeOperation,
  removeTargetFromInitiativeOperation,
  createScenarioOperation,
  updateScenarioOperation,
  deleteScenarioOperation,
  createSupplierOperation,
  updateSupplierOperation,
  deleteSupplierOperation
} from './operations';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const {
    tracks,
    setTracks,
    factors,
    setFactors,
    measurements,
    setMeasurements,
    targets,
    setTargets,
    initiatives,
    setInitiatives,
    scenarios,
    setScenarios,
    suppliers,
    setSuppliers
  } = useEntityState();

  const {
    sidePanel,
    sidebarExpanded,
    openSidePanel,
    closeSidePanel,
    toggleSidebar
  } = useUIState();

  const {
    calculateTrackMeasurementsValue,
    extractPercentage,
    getFactorUnit,
    getInitiativesForTarget,
    getTrackStats
  } = useUtilityFunctions(tracks, factors, measurements, targets, initiatives);

  // CRUD operations
  const createTrack = (track: AppContextType['createTrack']) => {
    createTrackOperation(tracks, setTracks, track);
  };

  const updateTrack = (id: string, track: Partial<AppContextType['tracks'][0]>) => {
    updateTrackOperation(tracks, setTracks, id, track);
  };

  const deleteTrack = (id: string) => {
    deleteTrackOperation(tracks, factors, measurements, targets, setTracks, id);
  };

  const createFactor = (factor: AppContextType['createFactor']) => {
    createFactorOperation(factors, setFactors, factor);
  };

  const updateFactor = (id: string, factor: Partial<AppContextType['factors'][0]>) => {
    updateFactorOperation(factors, setFactors, measurements, setMeasurements, id, factor);
  };

  const deleteFactor = (id: string) => {
    deleteFactorOperation(factors, setFactors, measurements, setMeasurements, id);
  };

  const createMeasurement = (measurement: AppContextType['createMeasurement']) => {
    createMeasurementOperation(factors, measurements, setMeasurements, measurement);
  };

  const updateMeasurement = (id: string, measurement: Partial<AppContextType['measurements'][0]>) => {
    updateMeasurementOperation(measurements, setMeasurements, factors, id, measurement);
  };

  const deleteMeasurement = (id: string) => {
    deleteMeasurementOperation(measurements, setMeasurements, id);
  };

  const createTarget = (target: AppContextType['createTarget']) => {
    createTargetOperation(targets, setTargets, target);
  };

  const updateTarget = (id: string, target: Partial<AppContextType['targets'][0]>) => {
    updateTargetOperation(targets, setTargets, id, target);
  };

  const deleteTarget = (id: string) => {
    deleteTargetOperation(targets, setTargets, initiatives, setInitiatives, id);
  };

  const createInitiative = (initiative: AppContextType['createInitiative']) => {
    createInitiativeOperation(
      initiatives,
      setInitiatives,
      targets,
      extractPercentage,
      initiative
    );
  };

  const updateInitiative = (id: string, initiative: Partial<AppContextType['initiatives'][0]>) => {
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

  const createScenario = (scenario: AppContextType['createScenario']) => {
    createScenarioOperation(scenarios, setScenarios, targets, setTargets, scenario);
  };

  const updateScenario = (id: string, scenario: Partial<AppContextType['scenarios'][0]>) => {
    updateScenarioOperation(scenarios, setScenarios, id, scenario);
  };

  const deleteScenario = (id: string) => {
    deleteScenarioOperation(scenarios, setScenarios, targets, setTargets, id);
  };

  const createSupplier = (supplier: AppContextType['createSupplier']) => {
    createSupplierOperation(suppliers, setSuppliers, supplier);
  };

  const updateSupplier = (id: string, supplier: Partial<AppContextType['suppliers'][0]>) => {
    updateSupplierOperation(suppliers, setSuppliers, id, supplier);
  };

  const deleteSupplier = (id: string) => {
    deleteSupplierOperation(suppliers, setSuppliers, id);
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

  const value: AppContextType = {
    tracks,
    factors,
    measurements,
    targets,
    initiatives,
    scenarios,
    suppliers,
    sidePanel,
    sidebarExpanded,
    openSidePanel,
    closeSidePanel,
    toggleSidebar,
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
    getInitiativesByTargetId: getInitiativesForTarget,
    createScenario,
    updateScenario,
    deleteScenario,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    calculateTrackMeasurementsValue,
    extractPercentage,
    getFactorUnit,
    getInitiativesForTarget,
    getTrackStats
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
