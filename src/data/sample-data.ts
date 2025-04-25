
import { 
  Track, 
  Factor,
  Measurement, 
  Target, 
  Initiative, 
  Scenario, 
  Supplier
} from "../types";

// Sample Tracks
export const tracks: Track[] = [
  {
    id: "track-1",
    name: "Scope 1 Emissions",
    emoji: "🏭",
    description: "Direct emissions from owned or controlled sources",
    totalEmissions: 1250,
    unit: "tCO2e",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "track-2",
    name: "Scope 2 Emissions",
    emoji: "⚡",
    description: "Indirect emissions from purchased electricity, heating, and cooling",
    totalEmissions: 850,
    unit: "tCO2e",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "track-3",
    name: "Scope 3 Emissions",
    emoji: "🌐",
    description: "All other indirect emissions in a company's value chain",
    totalEmissions: 3200,
    unit: "tCO2e",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "track-4",
    name: "Water Usage",
    emoji: "💧",
    description: "Total water consumption across operations",
    totalEmissions: 45000,
    unit: "m³",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "track-5",
    name: "Waste Management",
    emoji: "🗑️",
    description: "Solid waste generation and disposal",
    totalEmissions: 320,
    unit: "tonnes",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  }
];

// Sample Factors
export const factors: Factor[] = [
  {
    id: "factor-1",
    trackId: "track-1",
    name: "Natural Gas Combustion",
    value: 0.2,
    unit: "kgCO2e/kWh",
    source: "EPA Emission Factors 2023",
    category: "Stationary Combustion",
    description: "Emission factor for natural gas combustion in industrial boilers",
    effectiveDate: "2023-01-01",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "factor-2",
    trackId: "track-1",
    name: "Company Vehicle Fleet",
    value: 2.31,
    unit: "kgCO2e/L",
    source: "GHG Protocol 2023",
    category: "Mobile Combustion",
    description: "Emission factor for diesel use in company vehicles",
    effectiveDate: "2023-01-01",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "factor-3",
    trackId: "track-2",
    name: "Grid Electricity",
    value: 0.35,
    unit: "kgCO2e/kWh",
    source: "National Grid 2023",
    category: "Purchased Electricity",
    description: "Emission factor for grid electricity",
    effectiveDate: "2023-01-01",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "factor-4",
    trackId: "track-3",
    name: "Air Travel",
    value: 0.25,
    unit: "kgCO2e/km",
    source: "DEFRA 2023",
    category: "Business Travel",
    description: "Emission factor for long-haul flights, economy class",
    effectiveDate: "2023-01-01",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "factor-5",
    trackId: "track-4",
    name: "Water Consumption Factor",
    value: 1,
    unit: "m³",
    source: "Water Utility 2023",
    category: "Water",
    description: "Direct measurement factor for water consumption",
    effectiveDate: "2023-01-01",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  }
];

// Sample Suppliers
export const suppliers: Supplier[] = [
  {
    id: "supplier-1",
    name: "EcoEnergy Solutions",
    industry: "Energy",
    location: "California, USA",
    contactPerson: "Jane Smith",
    email: "jane@ecoenergy.com",
    phone: "+1-555-123-4567",
    currency: "USD",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "supplier-2",
    name: "Green Transport Ltd",
    industry: "Transportation",
    location: "London, UK",
    contactPerson: "John Brown",
    email: "john@greentransport.com",
    phone: "+44-20-1234-5678",
    currency: "GBP",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "supplier-3",
    name: "Sustainable Materials Co",
    industry: "Manufacturing",
    location: "Berlin, Germany",
    contactPerson: "Anna Weber",
    email: "anna@sustainablematerials.com",
    phone: "+49-30-1234-5678",
    currency: "EUR",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  }
];

// Sample Scenarios
export const scenarios: Scenario[] = [
  {
    id: "scenario-1",
    name: "2030 Net Zero Roadmap",
    description: "Aggressive reduction plan to achieve net zero emissions by 2030",
    startDate: "2023-01-01",
    endDate: "2030-12-31",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "scenario-2",
    name: "Moderate Reduction Plan",
    description: "Balanced approach to emission reduction with moderate targets",
    startDate: "2023-01-01",
    endDate: "2035-12-31",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  }
];

// Sample Targets
export const targets: Target[] = [
  {
    id: "target-1",
    trackId: "track-1",
    scenarioId: "scenario-1",
    supplierId: "supplier-1",
    name: "Scope 1 Reduction",
    description: "Reduce direct emissions by transitioning to cleaner fuels",
    baselineValue: 1250,
    targetValue: 625,
    targetPercentage: 50,
    targetDate: "2025-12-31",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "target-2",
    trackId: "track-2",
    scenarioId: "scenario-1",
    name: "Renewable Energy Transition",
    description: "Increase renewable energy usage to reduce scope 2 emissions",
    baselineValue: 850,
    targetValue: 170,
    targetPercentage: 80,
    targetDate: "2026-12-31",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "target-3",
    trackId: "track-3",
    scenarioId: "scenario-2",
    supplierId: "supplier-2",
    name: "Supply Chain Optimization",
    description: "Work with suppliers to reduce scope 3 emissions",
    baselineValue: 3200,
    targetValue: 1920,
    targetPercentage: 40,
    targetDate: "2027-12-31",
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  }
];

// Sample Measurements
export const measurements: Measurement[] = [
  {
    id: "measurement-1",
    trackId: "track-1",
    factorId: "factor-1",
    supplierId: "supplier-1",
    date: "2023-01-31",
    quantity: 5000,
    unit: "kWh",
    notes: "January natural gas usage",
    calculatedValue: 1000, // 5000 * 0.2
    status: "active",
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: "2023-02-01T00:00:00Z"
  },
  {
    id: "measurement-2",
    trackId: "track-1",
    factorId: "factor-2",
    date: "2023-01-31",
    quantity: 500,
    unit: "L",
    notes: "January diesel consumption",
    calculatedValue: 1155, // 500 * 2.31
    status: "active",
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: "2023-02-01T00:00:00Z"
  },
  {
    id: "measurement-3",
    trackId: "track-2",
    factorId: "factor-3",
    date: "2023-01-31",
    quantity: 10000,
    unit: "kWh",
    notes: "January electricity usage",
    calculatedValue: 3500, // 10000 * 0.35
    status: "active",
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: "2023-02-01T00:00:00Z"
  }
];

// Sample Initiatives
export const initiatives: Initiative[] = [
  {
    id: "initiative-1",
    name: "Boiler Upgrade Program",
    description: "Replace old boilers with high-efficiency models",
    startDate: "2023-03-01",
    endDate: "2023-08-31",
    status: "in_progress",
    spend: 150000,
    trajectory: "linear",
    plan: "-6%",
    absolute: 312.5,
    targetIds: ["target-1"],
    currency: "USD",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z"
  },
  {
    id: "initiative-2",
    name: "Solar Panel Installation",
    description: "Install solar panels on facility rooftops",
    startDate: "2023-04-01",
    endDate: "2023-10-31",
    status: "in_progress",
    spend: 350000,
    trajectory: "linear",
    plan: "-8%",
    absolute: 340,
    targetIds: ["target-2"],
    currency: "USD",
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-02-15T00:00:00Z"
  },
  {
    id: "initiative-3",
    name: "Supply Chain Optimization",
    description: "Optimize logistics and reduce unnecessary transportation",
    startDate: "2023-05-01",
    endDate: "2024-04-30",
    status: "not_started",
    spend: 75000,
    trajectory: "every_year",
    plan: "-4%",
    absolute: 480,
    targetIds: ["target-3"],
    currency: "USD",
    createdAt: "2023-03-15T00:00:00Z",
    updatedAt: "2023-03-15T00:00:00Z"
  }
];

// Helper function to find items by related IDs
export const getTrackById = (id: string) => tracks.find(track => track.id === id);
export const getFactorsByTrackId = (trackId: string) => factors.filter(factor => factor.trackId === trackId);
export const getMeasurementsByTrackId = (trackId: string) => measurements.filter(measurement => measurement.trackId === trackId);
export const getTargetsByTrackId = (trackId: string) => targets.filter(target => target.trackId === trackId);
export const getInitiativesByTargetId = (targetId: string) => initiatives.filter(initiative => initiative.targetIds.includes(targetId));
export const getSupplierById = (id: string) => suppliers.find(supplier => supplier.id === id);
export const getTargetsByScenarioId = (scenarioId: string) => targets.filter(target => target.scenarioId === scenarioId);
