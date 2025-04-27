
import { 
  Track, Factor, Measurement, Target, 
  Initiative, Scenario, Supplier, 
  InitiativeStatus, TrajectoryType, PlanType 
} from '../types';
import { generateId } from '../contexts/utils';

// Create tracks with proper structure
export const tracks: Track[] = [
  {
    id: generateId('track'),
    name: '🌐 GHG Emissions',
    emoji: '🌐',
    unit: 'tCO2e',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalEmissions: 120000
  },
  {
    id: generateId('track'),
    name: '💧 Water Usage',
    emoji: '💧',
    unit: 'm³',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalEmissions: 85000
  }
];

// Create factors with proper structure - both attached to GHG Emissions track
export const factors: Factor[] = [
  {
    id: generateId('factor'),
    trackId: tracks[0].id, // GHG Emissions track
    name: 'Natural Gas Combustion',
    value: 0.185,
    unit: 'kgCO2e/kWh',
    category: 'Stationary Combustion',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('factor'),
    trackId: tracks[0].id, // GHG Emissions track
    name: 'Electricity Consumption',
    value: 0.00035,
    unit: 'kgCO2e/kWh',
    category: 'Purchased Electricity',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Create suppliers with proper structure
export const suppliers: Supplier[] = [
  {
    id: generateId('supplier'),
    name: 'Patagonia',
    industry: 'Apparel',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@patagonia.com',
    phone: '555-1234',
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
    phone: '555-5678',
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
    phone: '555-9012',
    currency: 'USD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Create scenarios with proper structure
export const scenarios: Scenario[] = [
  {
    id: generateId('scenario'),
    name: 'Net Zero 2030',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('scenario'),
    name: 'Carbon Reduction Plan',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Create targets with proper structure - 3 for each scenario, linked to Patagonia
export const targets: Target[] = [
  // Targets for Net Zero 2030 scenario
  {
    id: generateId('target'),
    name: 'Scope 1 Reduction',
    trackId: tracks[0].id,
    baselineValue: 120000,
    targetValue: 90000,
    targetPercentage: 25,
    targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString(),
    status: 'active',
    supplierId: suppliers[0].id, // Patagonia
    scenarioId: scenarios[0].id, // Net Zero 2030
    description: 'Reduce Scope 1 emissions through energy efficiency measures',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('target'),
    name: 'Electricity Consumption',
    trackId: tracks[0].id,
    baselineValue: 85000,
    targetValue: 65000,
    targetPercentage: 23.5,
    targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString(),
    status: 'active',
    supplierId: suppliers[0].id, // Patagonia
    scenarioId: scenarios[0].id, // Net Zero 2030
    description: 'Reduce electricity consumption through renewable energy sourcing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('target'),
    name: 'Production Emissions',
    trackId: tracks[0].id,
    baselineValue: 50000,
    targetValue: 40000,
    targetPercentage: 20,
    targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString(),
    status: 'active',
    supplierId: suppliers[0].id, // Patagonia
    scenarioId: scenarios[0].id, // Net Zero 2030
    description: 'Reduce manufacturing emissions through process optimization',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // Targets for Carbon Reduction Plan scenario
  {
    id: generateId('target'),
    name: 'Supply Chain Footprint',
    trackId: tracks[0].id,
    baselineValue: 95000,
    targetValue: 76000,
    targetPercentage: 20,
    targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString(),
    status: 'pending',
    supplierId: suppliers[0].id, // Patagonia
    scenarioId: scenarios[1].id, // Carbon Reduction Plan
    description: 'Decrease emissions from supply chain operations',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('target'),
    name: 'Logistics Optimization',
    trackId: tracks[0].id,
    baselineValue: 35000,
    targetValue: 26250,
    targetPercentage: 25,
    targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString(),
    status: 'pending',
    supplierId: suppliers[0].id, // Patagonia
    scenarioId: scenarios[1].id, // Carbon Reduction Plan
    description: 'Optimize logistics routes and modes of transport',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('target'),
    name: 'Materials Sourcing',
    trackId: tracks[0].id,
    baselineValue: 70000,
    targetValue: 49000,
    targetPercentage: 30,
    targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 4)).toISOString(),
    status: 'active',
    supplierId: suppliers[0].id, // Patagonia
    scenarioId: scenarios[1].id, // Carbon Reduction Plan
    description: 'Source more sustainable and low-carbon materials',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Create measurements with proper structure - 4 measurements attached to GHG Emissions track
export const measurements: Measurement[] = [
  {
    id: generateId('measurement'),
    trackId: tracks[0].id, // GHG Emissions track
    factorId: factors[0].id, // Natural Gas Combustion
    quantity: 240000,
    unit: 'kWh',
    date: new Date().toISOString(),
    calculatedValue: 44400,
    status: 'active',
    notes: 'Q1 natural gas consumption for heating',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('measurement'),
    trackId: tracks[0].id, // GHG Emissions track
    factorId: factors[0].id, // Natural Gas Combustion
    quantity: 210000,
    unit: 'kWh',
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    calculatedValue: 38850,
    status: 'active',
    notes: 'Q2 natural gas consumption for heating',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('measurement'),
    trackId: tracks[0].id, // GHG Emissions track
    factorId: factors[1].id, // Electricity Consumption
    quantity: 110000000,
    unit: 'kWh',
    date: new Date().toISOString(),
    calculatedValue: 38500,
    status: 'active',
    notes: 'Q1 electricity consumption',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId('measurement'),
    trackId: tracks[0].id, // GHG Emissions track
    factorId: factors[1].id, // Electricity Consumption
    quantity: 132857142.85714286,
    unit: 'kWh',
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    calculatedValue: 46500,
    status: 'active',
    notes: 'Q2 electricity consumption',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper to generate initiatives for a target
const generateInitiativesForTarget = (targetId: string): Initiative[] => {
  const plans: PlanType[] = ['-15%', '-10%', '-5%'];
  const statuses: InitiativeStatus[] = ['not_started', 'in_progress', 'completed'];
  
  return Array.from({ length: 3 }, (_, i) => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + i);
    
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1 + i);
    
    return {
      id: generateId('initiative'),
      name: `Initiative ${i+1} for ${targetId}`,
      description: `Implementation plan ${i+1} for target ${targetId}`,
      targetIds: [targetId],
      plan: plans[i] as PlanType,
      trajectory: 'linear',
      status: statuses[i],
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      spend: 50000 + (i * 25000),
      absolute: 5000 + (i * 2500),
      currency: 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
};

// Create initiatives - 3 for each target
export const initiatives: Initiative[] = [
  ...targets.flatMap(target => generateInitiativesForTarget(target.id))
];
