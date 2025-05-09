
import { Track, Factor, Measurement, Target, Initiative, Supplier } from '@/types';
import { QueryType, SweepyResponse } from './types';
import { identifyQueryType } from './utils/queryParser';
import { processEmissionsQuery } from './processors/emissionsProcessor';
import { processTargetsQuery } from './processors/targetsProcessor';
import { processSuppliersQuery } from './processors/suppliersProcessor';
import { processProgressQuery } from './processors/progressProcessor';

// Re-export types and utility functions for convenience
export type { QueryType, SweepyResponse } from './types';
export { identifyQueryType, extractTimePeriod, extractQuantity } from './utils/queryParser';
export { processEmissionsQuery } from './processors/emissionsProcessor';
export { processTargetsQuery } from './processors/targetsProcessor';
export { processSuppliersQuery } from './processors/suppliersProcessor';
export { processProgressQuery } from './processors/progressProcessor';

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
