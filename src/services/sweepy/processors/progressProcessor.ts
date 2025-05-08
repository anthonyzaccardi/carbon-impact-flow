
import { Measurement, Target } from '@/types';
import { SweepyResponse } from '../types';

// Process progress tracking queries
export const processProgressQuery = (
  query: string,
  measurements: Measurement[],
  targets: Target[]
): SweepyResponse => {
  // Get active targets with target dates in the future
  const activeTargets = targets.filter(t => 
    t.status !== 'completed' && 
    new Date(t.targetDate) > new Date()
  );
  
  // Calculate overall progress
  const currentTotalEmissions = measurements.reduce((sum, m) => sum + m.calculatedValue, 0);
  const totalBaseline = activeTargets.reduce((sum, t) => sum + t.baselineValue, 0);
  const totalTarget = activeTargets.reduce((sum, t) => sum + t.targetValue, 0);
  
  // Calculate the current reduction as a percentage of the total target
  const targetReduction = totalBaseline - totalTarget;
  const currentReduction = totalBaseline - currentTotalEmissions;
  const progress = targetReduction ? (currentReduction / targetReduction) * 100 : 0;
  const progressPercent = Math.max(0, Math.min(100, progress)).toFixed(1);
  
  // Find the overall target reduction percentage
  const overallTargetPercent = totalBaseline ? 
    ((totalBaseline - totalTarget) / totalBaseline * 100).toFixed(1) : '0';
  
  // Generate month-by-month data for the current year
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthlyData = [];
  for (let i = 0; i <= 11; i++) {
    if (i <= currentMonth) {
      // For past and current months, use actual data
      const monthMeasurements = measurements.filter(m => {
        const date = new Date(m.date);
        return date.getFullYear() === currentYear && date.getMonth() === i;
      });
      
      // Fixed the bug: converting progressPercent string to number before multiplication
      const progressValue = parseFloat(progressPercent);
      const value = monthMeasurements.length > 0 ? 
        progressValue * (i / currentMonth) : // Fixed: Now using a number for the calculation
        null;
      
      monthlyData.push({
        name: new Date(currentYear, i, 1).toLocaleString('default', { month: 'short' }),
        value: value ? parseFloat(value.toFixed(1)) : null
      });
    } else {
      // For future months, use target projection
      const targetValue = parseFloat(overallTargetPercent) * (i / 11);
      monthlyData.push({
        name: new Date(currentYear, i, 1).toLocaleString('default', { month: 'short' }),
        target: parseFloat(targetValue.toFixed(1))
      });
    }
  }
  
  return {
    summary: `Your emissions reduction is tracking at ${progressPercent}% against your annual target of ${overallTargetPercent}%.`,
    chartType: 'line',
    chartData: monthlyData,
    linkText: 'View Targets',
    linkUrl: '/targets'
  };
};
