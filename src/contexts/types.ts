
import { SidePanel, Track, Factor, Measurement, Target, Initiative, Scenario, Supplier, MeasurementStatus, Status } from '../types';

export interface AppContextType {
  // Data
  tracks: Track[];
  factors: Factor[];
  measurements: Measurement[];
  targets: Target[];
  initiatives: Initiative[];
  scenarios: Scenario[];
  suppliers: Supplier[];
  
  // UI state
  sidePanel: SidePanel;
  sidebarExpanded: boolean;
  loading: boolean;
  
  // Data setter functions for Supabase integration
  setTracks: (tracks: Track[]) => void;
  setFactors: (factors: Factor[]) => void;
  setMeasurements: (measurements: Measurement[]) => void;
  setTargets: (targets: Target[]) => void;
  setInitiatives: (initiatives: Initiative[]) => void;
  setScenarios: (scenarios: Scenario[]) => void;
  setSuppliers: (suppliers: Supplier[]) => void;
  
  // Actions
  openSidePanel: (type: 'create' | 'edit' | 'view', entityType: SidePanel['entityType'], data?: any) => void;
  closeSidePanel: () => void;
  toggleSidebar: () => void;
  refreshScenarios: () => Promise<Scenario[]>;
  
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
  extractPercentage: (plan: string) => number;
  getFactorUnit: (factorId: string) => string;
  getInitiativesForTarget: (targetId: string) => Initiative[];
  getTrackStats: (trackId: string) => { factorsCount: number; measurementsCount: number; targetsCount: number };
}
