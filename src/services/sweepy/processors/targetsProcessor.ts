
import { Target } from '@/types';
import { SweepyResponse } from '../types';

// Process targets related queries
export const processTargetsQuery = (
  query: string,
  targets: Target[]
): SweepyResponse => {
  // Count targets by status
  const completed = targets.filter(t => t.status === 'completed').length;
  const inProgress = targets.filter(t => t.status === 'in_progress').length;
  const notStarted = targets.filter(t => t.status === 'not_started').length;
  const total = targets.length;
  
  return {
    summary: `You currently have ${total} targets, with ${completed} completed, ${inProgress} in progress, and ${notStarted} not started.`,
    chartType: 'pie',
    chartData: [
      { name: 'Completed', value: completed },
      { name: 'In Progress', value: inProgress },
      { name: 'Not Started', value: notStarted },
    ],
    linkText: 'View Targets',
    linkUrl: '/targets'
  };
};
