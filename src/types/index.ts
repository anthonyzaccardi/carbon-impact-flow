
export type Status = 'active' | 'pending' | 'completed' | 'cancelled';
export type InitiativeStatus = 'not_started' | 'in_progress' | 'completed' | 'committed';
export type TrajectoryType = 'every_year' | 'linear';
export type PlanType = '-2%' | '-4%' | '-6%' | '-8%' | '-10%';

export interface Track {
  id: string;
  name: string;
  emoji: string;
  totalEmissions: number; // Calculated field
  createdAt: string;
  updatedAt: string;
  // Fields used in code but not in original definition
  description?: string;
  unit?: string;
  status?: Status;
}

export interface Factor {
  id: string;
  trackId: string;
  name: string;
  value: number;
  unit: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  // Fields used in code but not in original definition
  description?: string;
  source?: string;
  status?: Status;
  effectiveDate?: string;
  expirationDate?: string;
}

export interface Measurement {
  id: string;
  trackId: string;
  factorId: string;
  supplierId?: string;
  date: string;
  quantity: number;
  unit: string; // Inherited from factor
  calculatedValue: number;
  createdAt: string;
  updatedAt: string;
  // Fields used in code but not in original definition
  notes?: string;
  status?: Status;
}

export interface Target {
  id: string;
  trackId: string;
  scenarioId?: string;
  supplierId?: string;
  name: string;
  baselineValue: number;
  targetValue: number; // Auto-calculated
  targetPercentage: number;
  targetDate: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  // Fields used in code but not in original definition
  description?: string;
}

export interface Initiative {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: InitiativeStatus;
  spend: number;
  trajectory: TrajectoryType;
  plan: PlanType;
  absolute: number; // Auto-calculated
  targetIds: string[];
  currency: string;
  createdAt: string;
  updatedAt: string;
  // Fields used in code but not in original definition
  description?: string;
}

export interface Scenario {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  // Fields used in code but not in original definition
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: Status;
}

export interface Supplier {
  id: string;
  name: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  // Fields used in code but not in original definition
  location?: string;
  status?: Status;
}

export interface SidePanel {
  isOpen: boolean;
  type: 'create' | 'edit' | 'view';
  entityType: 'track' | 'factor' | 'measurement' | 'target' | 'initiative' | 'scenario' | 'supplier';
  data?: any;
}
