
import { Initiative, Target } from '@/types';

export interface InitiativeMetrics {
  totalInitiatives: number;
  activeInitiatives: number;
  totalSpend: number;
  totalImpact: number;
}

export const useInitiativeMetrics = (initiatives: Initiative[], targets?: Target[]): InitiativeMetrics => {
  const totalInitiatives = initiatives.length;
  const activeInitiatives = initiatives.filter(i => i.status === 'in_progress').length;
  const totalSpend = initiatives.reduce((sum, i) => sum + i.spend, 0);
  const totalImpact = initiatives.reduce((sum, i) => sum + i.absolute, 0);

  return {
    totalInitiatives,
    activeInitiatives,
    totalSpend,
    totalImpact
  };
};
