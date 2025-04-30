
import { useAppContext } from "@/contexts/useAppContext";
import StatCard from "@/components/ui/stat-card";
import { Activity, ArrowUp, Users, Calendar, Cloud } from "lucide-react";
import MiniSparkline from "@/components/charts/MiniSparkline";
import MiniBarChart from "@/components/charts/MiniBarChart";
import MiniDonutChart from "@/components/charts/MiniDonutChart";
import ProgressIndicator from "@/components/charts/ProgressIndicator";

const Overview = () => {
  const {
    tracks,
    measurements,
    targets,
    initiatives
  } = useAppContext();
  
  const totalEmissions = tracks.reduce((sum, track) => {
    const trackMeasurements = measurements.filter(m => m.trackId === track.id);
    const trackEmissions = trackMeasurements.reduce((trackSum, measurement) => trackSum + measurement.calculatedValue, 0);
    return sum + trackEmissions;
  }, 0);
  
  const emissionsChange = 5.2; // Example trend, replace with actual calculation if needed
  
  // Sample data for charts - in a real application, you would calculate these from actual data
  const emissionsData = [
    { name: 'Jan', value: 5200 },
    { name: 'Feb', value: 4800 },
    { name: 'Mar', value: 6100 },
    { name: 'Apr', value: 5400 },
    { name: 'May', value: 5000 },
    { name: 'Jun', value: 4700 },
  ];
  
  const trackDistributionData = tracks.slice(0, 4).map(track => ({
    name: track.name,
    value: track.totalEmissions
  }));
  
  const measurementTrendsData = [
    { name: 'Week 1', value: 25 },
    { name: 'Week 2', value: 40 },
    { name: 'Week 3', value: 30 },
    { name: 'Week 4', value: 45 },
  ];
  
  const targetProgressData = {
    current: targets.reduce((sum, target) => sum + (target.baselineValue - target.targetValue), 0),
    target: targets.reduce((sum, target) => sum + target.baselineValue, 0) * 0.3 // Assuming 30% reduction goal
  };

  return (
    <div className="p-6 px-0 py-0">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Overview Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track your environmental impact metrics and progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Tracks" 
          value={tracks.length.toString()} 
          description="Active emission tracking categories" 
          icon={<Activity className="text-purple-500" />} 
          chart={<MiniBarChart data={trackDistributionData} height={60} />}
        />

        <StatCard 
          title="Active Measurements" 
          value={measurements.length.toString()} 
          description="Total recorded measurements" 
          icon={<Calendar className="text-blue-500" />}
          chart={<MiniSparkline data={measurementTrendsData} color="#1EAEDB" height={60} />}
        />

        <StatCard 
          title="Set Targets" 
          value={targets.length.toString()} 
          description="Emission reduction targets" 
          icon={<ArrowUp className="text-green-500" />}
          chart={<ProgressIndicator 
            current={targetProgressData.current} 
            target={targetProgressData.target} 
            color="#10B981" 
          />}
        />

        <StatCard 
          title="Ongoing Initiatives" 
          value={initiatives.length.toString()} 
          description="Active reduction programs" 
          icon={<Users className="text-orange-500" />}
          chart={<MiniBarChart 
            data={initiatives.slice(0, 5).map((i, idx) => ({ 
              name: `Initiative ${idx + 1}`, 
              value: Math.random() * 100 
            }))}
            color="#F97316" 
            height={60} 
          />}
        />
        
        <StatCard 
          title="Total Emissions" 
          value={`${totalEmissions.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })} tCO₂e`} 
          description="Carbon dioxide equivalent" 
          icon={<Cloud className="text-gray-500" />} 
          className="md:col-span-2 lg:col-span-4" 
          trend={{
            value: emissionsChange,
            isPositive: false
          }}
          chart={<MiniSparkline data={emissionsData} color="#64748B" height={60} />}
        />
      </div>
    </div>
  );
};

export default Overview;
