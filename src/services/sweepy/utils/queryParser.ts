
import { QueryType } from '../types';

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
