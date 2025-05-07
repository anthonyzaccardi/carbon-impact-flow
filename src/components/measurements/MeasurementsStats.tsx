
import StatCard from "@/components/ui/stat-card";
import MiniSparkline from "@/components/charts/MiniSparkline";
import MiniBarChart from "@/components/charts/MiniBarChart";
import MiniDonutChart from "@/components/charts/MiniDonutChart";
import { Measurement, Track, Supplier } from "@/types";

interface MeasurementsStatsProps {
  measurements: Measurement[];
  tracks: Track[];
  suppliers: Supplier[];
}

const MeasurementsStats = ({ measurements, tracks, suppliers }: MeasurementsStatsProps) => {
  // Stats calculations
  const totalMeasurements = measurements.length;
  const totalEmissions = measurements.reduce((sum, m) => sum + m.calculatedValue, 0);
  const latestDate = measurements.length > 0 
    ? new Date(Math.max(...measurements.map(m => new Date(m.date).getTime()))).toLocaleDateString() 
    : 'N/A';
  const uniqueSuppliers = new Set(measurements.map(m => m.supplierId).filter(Boolean)).size;
  
  // Sample data for charts
  const measurementTrendsData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return {
      name: date.toLocaleDateString('en-US', { month: 'short' }),
      value: measurements.filter(m => {
        const mDate = new Date(m.date);
        return mDate.getMonth() === date.getMonth() && mDate.getFullYear() === date.getFullYear();
      }).length
    };
  });
  
  const emissionsByTrackData = tracks.slice(0, 4).map(track => ({
    name: track.name,
    value: measurements
      .filter(m => m.trackId === track.id)
      .reduce((sum, m) => sum + m.calculatedValue, 0)
  }));
  
  const measurementsBySupplierData = suppliers.slice(0, 6).map(supplier => ({
    name: supplier.name,
    value: measurements.filter(m => m.supplierId === supplier.id).length
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard 
        title="Total measurements" 
        value={totalMeasurements}
        chart={<MiniSparkline 
          data={measurementTrendsData} 
          color="#1EAEDB" 
          height={60} 
        />}
      />
      <StatCard 
        title="Total calculated" 
        value={`${totalEmissions.toLocaleString()} tCO2e`}
        chart={<MiniBarChart 
          data={emissionsByTrackData} 
          color="#8B5CF6" 
          height={60} 
        />}
      />
      <StatCard 
        title="Latest entry" 
        value={latestDate}
        chart={<MiniSparkline 
          data={Array.from({ length: 7 }, (_, i) => ({
            name: `Day ${i + 1}`,
            value: Math.random() * 10 + 5
          }))}
          color="#10B981" 
          height={60} 
        />}
      />
      <StatCard 
        title="Suppliers" 
        value={uniqueSuppliers}
        chart={<MiniDonutChart 
          data={measurementsBySupplierData.slice(0, 4)} 
          height={80} 
        />}
      />
    </div>
  );
};

export default MeasurementsStats;
