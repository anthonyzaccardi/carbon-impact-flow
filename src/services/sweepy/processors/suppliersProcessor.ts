
import { Supplier, Measurement } from '@/types';
import { SweepyResponse } from '../types';
import { extractQuantity } from '../utils/queryParser';

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
