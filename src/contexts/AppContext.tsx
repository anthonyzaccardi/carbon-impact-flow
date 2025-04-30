
import { createContext, ReactNode } from 'react';
import { AppContextType } from './types';
import { useEntityState } from './hooks/useEntityState';
import { useUIState } from './hooks/useUIState';
import { useUtilityFunctions } from './hooks/useUtilityFunctions';
import { useEffects } from './hooks/useEffects';
import { useTrackCrud } from './hooks/useTrackCrud';
import { useFactorCrud } from './hooks/useFactorCrud';
import { useMeasurementCrud } from './hooks/useMeasurementCrud';
import { useTargetCrud } from './hooks/useTargetCrud';
import { useInitiativeCrud } from './hooks/useInitiativeCrud';
import { useScenarioCrud } from './hooks/useScenarioCrud';
import { useSupplierCrud } from './hooks/useSupplierCrud';

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
  } = useUtilityFunctions({ tracks, factors, measurements, targets, initiatives });

  // Use the effects hook
  useEffects(tracks, setTracks, targets, setTargets);

  const trackCrud = useTrackCrud(tracks, setTracks, factors, measurements, targets);
  const factorCrud = useFactorCrud(factors, setFactors, measurements, setMeasurements);
  const measurementCrud = useMeasurementCrud(factors, measurements, setMeasurements);
  const targetCrud = useTargetCrud(targets, setTargets, initiatives, setInitiatives);
  const initiativeCrud = useInitiativeCrud(initiatives, setInitiatives, targets, extractPercentage);
  const scenarioCrud = useScenarioCrud(scenarios, setScenarios, targets, setTargets);
  const supplierCrud = useSupplierCrud(suppliers, setSuppliers);

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
    ...trackCrud,
    ...factorCrud,
    ...measurementCrud,
    ...targetCrud,
    ...initiativeCrud,
    ...scenarioCrud,
    ...supplierCrud,
    getInitiativesByTargetId: getInitiativesForTarget,
    calculateTrackMeasurementsValue,
    extractPercentage,
    getFactorUnit,
    getInitiativesForTarget,
    getTrackStats
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
