
import { Track, Factor, Measurement } from '@/types';
import { SweepyResponse } from '../types';
import { extractTimePeriod } from '../utils/queryParser';

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
