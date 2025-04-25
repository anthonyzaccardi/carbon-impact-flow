
export const generateId = (prefix: string) => `${prefix}-${Date.now()}`;
export const getCurrentTimestamp = () => new Date().toISOString();

export const calculateInitiativeAbsoluteValue = (
  initiative: { targetIds: string[]; plan: string },
  targets: Array<{ id: string; targetValue: number }>,
  extractPercentage: (plan: string) => number
): number => {
  const initiativeTargets = targets.filter(t => initiative.targetIds.includes(t.id));
  
  if (initiativeTargets.length === 0) return 0;
  
  return initiativeTargets.reduce((sum, target) => {
    return sum + (target.targetValue * Math.abs(extractPercentage(initiative.plan)));
  }, 0);
};
