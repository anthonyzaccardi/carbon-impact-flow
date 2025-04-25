import { 
  Track, Factor, Measurement, Target, 
  Initiative, Scenario, Supplier, 
  InitiativeStatus, TrajectoryType, PlanType 
} from '../types';
import { generateId } from '../contexts/utils';

// Create tracks with proper structure (no description)
export const tracks: Track[] = [
  {
    id: generateId('track'),
    name: '🏭 Scope 1',
    emoji: '🏭',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalEmissions: 120000,
    unit: 'tCO2e'
  },
  {
    id: generateId('track'),
    name: '⚡ Scope 2',
    emoji: '⚡',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalEmissions: 85000,
    unit: 'tCO2e'
  },
  {
    id: generateId('track'),
    name: '🚗 Scope 3',
    emoji: '🚗',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalEmissions: 50000,
    unit: 'tCO2e'
  }
];

// Create factors with proper structure (no source)
export const factors: Factor[] = [
  {
    id: generateId('factor'),
    trackId: tracks[0].id,
    name: 'Natural Gas Combustion',
    value: 0.185,
    unit: 'kgCO2e/kWh',
    category: 'Stationary Combustion',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('factor'),
    trackId: tracks[1].id,
    name: 'Purchased Electricity',
    value: 0.00035,
    unit: 'kgCO2e/kWh',
    category: 'Purchased Electricity',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('factor'),
    trackId: tracks[2].id,
    name: 'Employee Commuting',
    value: 0.00012,
    unit: 'kgCO2e/km',
    category: 'Employee Commuting',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Create suppliers with proper structure (no location)
export const suppliers: Supplier[] = [
  {
    id: generateId('supplier'),
    name: 'EcoSupply Solutions',
    industry: 'Manufacturing',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@ecosupply.com',
    currency: 'USD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('supplier'),
    name: 'GreenTech Innovations',
    industry: 'Technology',
    contactPerson: 'David Lee',
    email: 'david@greentech.com',
    currency: 'EUR',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('supplier'),
    name: 'Sustainable Energy Corp',
    industry: 'Energy',
    contactPerson: 'Emily White',
    email: 'emily@sustainableenergy.com',
    currency: 'USD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Create scenarios with proper structure (no description)
export const scenarios: Scenario[] = [
  {
    id: generateId('scenario'),
    name: 'Base Sustainability Plan',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('scenario'),
    name: 'Advanced Reduction Scenario',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('scenario'),
    name: 'Net-Zero Target 2050',
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Create targets with proper structure (no description)
export const targets: Target[] = [
  {
    id: generateId('target'),
    name: 'Scope 1 Reduction',
    trackId: tracks[0].id,
    baselineValue: 120000,
    targetValue: 90000,
    targetPercentage: 25,
    targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString(),
    status: 'active',
    scenarioId: scenarios[0].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('target'),
    name: 'Electricity Consumption',
    trackId: tracks[1].id,
    baselineValue: 85000,
    targetValue: 65000,
    targetPercentage: 23.5,
    targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString(),
    status: 'active',
    scenarioId: scenarios[1].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('target'),
    name: 'Commuting Emissions',
    trackId: tracks[2].id,
    baselineValue: 50000,
    targetValue: 40000,
    targetPercentage: 20,
    targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString(),
    status: 'active',
    scenarioId: scenarios[2].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Create measurements with proper structure (no notes)
export const measurements: Measurement[] = [
  {
    id: generateId('measurement'),
    trackId: tracks[0].id,
    factorId: factors[0].id,
    quantity: 540000,
    unit: 'kWh',
    date: new Date().toISOString(),
    calculatedValue: 99900,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('measurement'),
    trackId: tracks[1].id,
    factorId: factors[1].id,
    quantity: 242857142.85714286,
    unit: 'kWh',
    date: new Date().toISOString(),
    calculatedValue: 85000,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('measurement'),
    trackId: tracks[2].id,
    factorId: factors[2].id,
    quantity: 416666666.6666667,
    unit: 'km',
    date: new Date().toISOString(),
    calculatedValue: 50000,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Create initiatives with proper structure (no description)
export const initiatives: Initiative[] = [
  {
    id: generateId('initiative'),
    name: 'Energy Efficiency Program',
    targetIds: [targets[0].id, targets[1].id],
    plan: '-15%',
    trajectory: 'linear',
    status: 'in_progress',
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString(),
    spend: 75000,
    absolute: 30750,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('initiative'),
    name: 'Renewable Energy Sourcing',
    targetIds: [targets[1].id],
    plan: '-10%',
    trajectory: 'linear',
    status: 'committed',
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString(),
    spend: 120000,
    absolute: 8500,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('initiative'),
    name: 'Sustainable Commuting',
    targetIds: [targets[2].id],
    plan: '-5%',
    trajectory: 'linear',
    status: 'not_started',
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    spend: 30000,
    absolute: 2500,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
