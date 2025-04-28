
import { 
  Track, Factor, Measurement, Target, 
  Initiative, Scenario, Supplier 
} from '../types';
import { generateId } from '../contexts/utils';

// Initialize with empty arrays for most entities
export const tracks: Track[] = [];
export const factors: Factor[] = [];
export const measurements: Measurement[] = [];
export const targets: Target[] = [];
export const scenarios: Scenario[] = [];
export const suppliers: Supplier[] = [];

// Add sample initiatives
export const initiatives: Initiative[] = [
  {
    id: generateId('initiative'),
    name: "Solar Panel Installation",
    description: "Install solar panels across facilities to reduce grid electricity consumption",
    startDate: "2025-06-01",
    endDate: "2025-12-31",
    status: "not_started",
    spend: 500000,
    trajectory: "linear",
    plan: "-10%",
    absolute: 150,
    targetIds: [],
    currency: "USD",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('initiative'),
    name: "Electric Vehicle Fleet Transition",
    description: "Replace current vehicle fleet with electric alternatives",
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    status: "not_started",
    spend: 750000,
    trajectory: "every_year",
    plan: "-15%",
    absolute: 300,
    targetIds: [],
    currency: "USD",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('initiative'),
    name: "Energy Efficient Lighting",
    description: "Upgrade to LED lighting systems across all locations",
    startDate: "2025-05-01",
    endDate: "2025-08-31",
    status: "not_started",
    spend: 100000,
    trajectory: "linear",
    plan: "-5%",
    absolute: 75,
    targetIds: [],
    currency: "USD",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
