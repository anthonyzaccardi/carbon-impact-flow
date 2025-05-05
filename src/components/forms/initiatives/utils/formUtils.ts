
import { Initiative, Target } from '@/types';
import { InitiativeFormData } from '../schema';
import { format } from 'date-fns';

export const prepareInitialValues = (
  initialData?: Initiative,
  selectedTargets?: Target[]
): InitiativeFormData => {
  if (initialData) {
    return {
      ...initialData,
      startDate: new Date(initialData.startDate),
      endDate: new Date(initialData.endDate),
      targetIds: initialData.targetIds || []
    };
  }

  return {
    name: '',
    description: '',
    status: 'not_started',
    plan: '-5%', // Fixed the empty string to a valid value
    targetIds: [],
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    spend: 0,
    budget: 0,
    currency: 'USD',
    trajectory: 'linear'
  };
};

// Renamed from getInitiativeFormDefaultValues to match what's being imported
export const getInitiativeFormDefaultValues = (initialData?: Initiative): InitiativeFormData => {
  if (initialData) {
    return {
      ...initialData,
      startDate: new Date(initialData.startDate),
      endDate: new Date(initialData.endDate),
      targetIds: initialData.targetIds || []
    };
  }

  return {
    name: '',
    description: '',
    status: 'not_started',
    plan: '-5%',
    targetIds: [],
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    spend: 0,
    budget: 0,
    currency: 'USD',
    trajectory: 'linear'
  };
};

export const prepareSubmitData = (
  data: InitiativeFormData,
  extractPercentage: (plan: string) => number,
  selectedTargets: Target[]
) => {
  return {
    ...data,
    startDate: format(data.startDate, 'yyyy-MM-dd'),
    endDate: format(data.endDate, 'yyyy-MM-dd'),
    absolute: calculateAbsoluteValue(data, extractPercentage, selectedTargets),
    targets: undefined, // Remove targets from the submitted data
    targetIds: selectedTargets.map(target => target.id)
  };
};

export const calculateAbsoluteValue = (
  data: InitiativeFormData,
  extractPercentage: (plan: string) => number,
  selectedTargets: Target[]
): number => {
  if (!selectedTargets.length || !data.plan) return 0;
  
  const percentage = extractPercentage(data.plan);
  return selectedTargets.reduce((sum, target) => {
    return sum + (target.baselineValue * percentage);
  }, 0);
};
