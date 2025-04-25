
export type Status = 'active' | 'pending' | 'completed' | 'cancelled';
export type InitiativeStatus = 'not_started' | 'in_progress' | 'completed' | 'committed';
export type TrajectoryType = 'every_year' | 'linear';
export type PlanType = '-2%' | '-4%' | '-6%' | '-8%' | '-10%';

export interface Track {
  id: string;
  name: string;
  emoji: string;
  description: string;
  totalEmissions: number;
  unit: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Factor {
  id: string;
  trackId: string;
  name: string;
  value: number;
  unit: string;
  source: string;
  category: string;
  description: string;
  effectiveDate: string;
  expirationDate?: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Measurement {
  id: string;
  trackId: string;
  factorId: string;
  supplierId?: string;
  date: string;
  quantity: number;
  unit: string;
  notes?: string;
  calculatedValue: number;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Target {
  id: string;
  trackId: string;
  scenarioId?: string;
  supplierId?: string;
  name: string;
  description: string;
  baselineValue: number;
  targetValue: number;
  targetPercentage: number;
  targetDate: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Initiative {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: InitiativeStatus;
  spend: number;
  trajectory: TrajectoryType;
  plan: PlanType;
  absolute: number;
  targetIds: string[];
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  industry: string;
  location: string;
  contactPerson: string;
  email: string;
  phone: string;
  currency: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface SidePanel {
  isOpen: boolean;
  type: 'create' | 'edit' | 'view';
  entityType: 'track' | 'factor' | 'measurement' | 'target' | 'initiative' | 'scenario' | 'supplier';
  data?: any;
}
