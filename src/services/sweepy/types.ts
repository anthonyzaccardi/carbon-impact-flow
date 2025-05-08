
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
