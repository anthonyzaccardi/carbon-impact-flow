
import { useAppContext } from '@/contexts/useAppContext';
import { Track, Factor, Measurement, Target, Initiative, Supplier } from '@/types';

// Types for Sweepy responses
export interface SweepyResponse {
  summary: string;
  chartType: 'bar' | 'line' | 'pie';
  chartData: any[];
  linkText: string;
  linkUrl: string;
}

// Type for the different query types Sweepy can handle
export type QueryType = 
  | 'emissions' 
  | 'targets' 
  | 'suppliers' 
  | 'progress' 
  | 'unknown';

// Match keywords to identify query type
export const identifyQueryType = (query: string): QueryType => {
  query = query.toLowerCase();
  
  if (query.includes('emission') || query.includes('carbon') || query.includes('co2') || query.includes('produce')) {
    return 'emissions';
  }
  
  if (query.includes('target') || query.includes('goal')) {
    return 'targets';
  }
  
  if (query.includes('supplier') || query.includes('vendor') || query.includes('provider')) {
    return 'suppliers';
  }
  
  if (query.includes('progress') || query.includes('track') || query.includes('status') || query.includes('completion')) {
    return 'progress';
  }
  
  return 'unknown';
};

// Identify time period from query if present
export const extractTimePeriod = (query: string): { year?: number, quarter?: number, month?: string } => {
  const result: { year?: number, quarter?: number, month?: string } = {};
  
  // Match year patterns like "2023" or "in 2024"
  const yearMatch = query.match(/\b(20\d{2})\b/);
  if (yearMatch) {
    result.year = parseInt(yearMatch[1], 10);
  }
  
  // Match quarter patterns like "q1" or "quarter 2"
  const quarterMatch = query.match(/\bq([1-4])\b|\bquarter ([1-4])\b/i);
  if (quarterMatch) {
    result.quarter = parseInt(quarterMatch[1] || quarterMatch[2], 10);
  }
  
  // Match month names
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                 'july', 'august', 'september', 'october', 'november', 'december'];
  for (const month of months) {
    if (query.toLowerCase().includes(month)) {
      result.month = month;
      break;
    }
  }
  
  return result;
};

// Extract quantity if specified (like "top 3", "top 5")
export const extractQuantity = (query: string): number | null => {
  const match = query.match(/\btop (\d+)\b/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
};

// Process emissions related queries
export const processEmissionsQuery = (
  query: string,
  measurements: Measurement[],
  factors: Factor[],
  tracks: Track[]
): SweepyResponse => {
  const timePeriod = extractTimePeriod(query);
  const currentYear = new Date().getFullYear();
  const targetYear = timePeriod.year || currentYear;
  let previousYear = targetYear - 1;
  
  // Filter measurements by year
  const thisYearMeasurements = measurements.filter(m => 
    new Date(m.date).getFullYear() === targetYear
  );
  
  const lastYearMeasurements = measurements.filter(m => 
    new Date(m.date).getFullYear() === previousYear
  );
  
  const totalEmissions = thisYearMeasurements.reduce((sum, m) => sum + m.calculatedValue, 0);
  const lastYearEmissions = lastYearMeasurements.reduce((sum, m) => sum + m.calculatedValue, 0);
  
  // Calculate percentage change
  const percentChange = lastYearEmissions ? 
    Math.round(((totalEmissions - lastYearEmissions) / lastYearEmissions) * 100) : 0;
  const changeDirection = percentChange < 0 ? 'less' : 'more';
  
  // Generate quarterly data for the chart
  const quarterlyData = Array(8).fill(0).map((_, idx) => {
    const year = idx < 4 ? previousYear : targetYear;
    const quarter = (idx % 4) + 1;
    const quarterMeasurements = measurements.filter(m => {
      const date = new Date(m.date);
      return date.getFullYear() === year && 
             Math.floor(date.getMonth() / 3) + 1 === quarter;
    });
    
    return {
      name: `Q${quarter} ${year}`,
      value: Math.round(quarterlyData.reduce((sum, m) => sum + m.calculatedValue, 0))
    };
  });
  
  return {
    summary: `In ${targetYear}, your company produced ${Math.round(totalEmissions)} tCO₂e, which is ${Math.abs(percentChange)}% ${changeDirection} than in ${previousYear}.`,
    chartType: 'bar',
    chartData: quarterlyData,
    linkText: 'View in Measurements',
    linkUrl: '/measurements'
  };
};

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

// Process suppliers related queries
export const processSuppliersQuery = (
  query: string,
  suppliers: Supplier[],
  measurements: Measurement[]
): SweepyResponse => {
  // Get the requested number of top suppliers or default to 5
  const topN = extractQuantity(query) || 5;
  
  // Calculate emissions per supplier
  const supplierEmissions = suppliers.map(supplier => {
    const supplierMeasurements = measurements.filter(m => m.supplierId === supplier.id);
    const emissions = supplierMeasurements.reduce((sum, m) => sum + m.calculatedValue, 0);
    
    return {
      id: supplier.id,
      name: supplier.name,
      emissions
    };
  });
  
  // Sort suppliers by emissions (highest first) and take top N
  const topSuppliers = supplierEmissions
    .sort((a, b) => b.emissions - a.emissions)
    .slice(0, topN);
  
  // Format data for chart
  const chartData = topSuppliers.map(s => ({
    name: s.name,
    value: Math.round(s.emissions)
  }));
  
  let summaryText;
  if (topSuppliers.length > 0) {
    const top3List = topSuppliers
      .slice(0, 3)
      .map(s => `${s.name} (${Math.round(s.emissions)} tCO₂e)`)
      .join(', ');
      
    summaryText = `Your top ${Math.min(3, topSuppliers.length)} suppliers by emissions are ${top3List}.`;
  } else {
    summaryText = "You don't have any suppliers with emissions data yet.";
  }
  
  return {
    summary: summaryText,
    chartType: 'bar',
    chartData,
    linkText: 'View Suppliers',
    linkUrl: '/suppliers'
  };
};

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
      
      const value = monthMeasurements.length > 0 ? 
        progressPercent * (i / currentMonth) : // Simplistic estimation
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

// Main function to process query and return response
export const processQuery = (
  query: string,
  tracks: Track[],
  factors: Factor[],
  measurements: Measurement[],
  targets: Target[],
  initiatives: Initiative[],
  suppliers: Supplier[]
): SweepyResponse => {
  const queryType = identifyQueryType(query);
  
  switch (queryType) {
    case 'emissions':
      return processEmissionsQuery(query, measurements, factors, tracks);
    
    case 'targets':
      return processTargetsQuery(query, targets);
    
    case 'suppliers':
      return processSuppliersQuery(query, suppliers, measurements);
    
    case 'progress':
      return processProgressQuery(query, measurements, targets);
    
    default:
      // Fallback response
      return {
        summary: "I'm not sure I understand that question. Could you try rephrasing it or asking about emissions, targets, suppliers, or tracking progress?",
        chartType: 'bar',
        chartData: [],
        linkText: 'Explore Dashboard',
        linkUrl: '/'
      };
  }
};
