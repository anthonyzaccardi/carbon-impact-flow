
import { 
  Track, Factor, Measurement, Target, 
  Initiative, Scenario, Supplier 
} from '../types';
import { generateId } from '../contexts/utils';

// Initialize with empty arrays for all entities
export const tracks: Track[] = [];
export const factors: Factor[] = [];
export const measurements: Measurement[] = [];
export const targets: Target[] = [];
export const initiatives: Initiative[] = []; // Removed default initiatives
export const scenarios: Scenario[] = [];
export const suppliers: Supplier[] = [];
