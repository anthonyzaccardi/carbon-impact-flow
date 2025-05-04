
import { useMemo } from 'react';
import { Initiative, Target } from '@/types';

export const useInitiativeCalculation = (
  targets: Target[],
  extractPercentage: (plan: string) => number
) => {
  const calculateInitiativeAbsoluteValue = useMemo(() => {
    return (initiative: Initiative): number => {
      const initiativeTargets = targets.filter(t => initiative.targetIds.includes(t.id));
      
      if (initiativeTargets.length === 0) return 0;
      
      return initiativeTargets.reduce((sum, target) => {
        // Handle potentially undefined plan value
        return sum + (target.targetValue * Math.abs(extractPercentage(initiative.plan)));
      }, 0);
    };
  }, [targets, extractPercentage]);

  return {
    calculateInitiativeAbsoluteValue
  };
};
