import { useAppContext } from "@/contexts/useAppContext";
import StatCard from "@/components/ui/stat-card";
import { Activity, ArrowUp, Users, Calendar, Cloud } from "lucide-react";
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

  return <div className="p-6 px-0 py-0">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Overview Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track your environmental impact metrics and progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tracks" value={tracks.length.toString()} description="Active emission tracking categories" icon={<Activity className="text-purple-500" />} />

        <StatCard title="Active Measurements" value={measurements.length.toString()} description="Total recorded measurements" icon={<Calendar className="text-blue-500" />} />

        <StatCard title="Set Targets" value={targets.length.toString()} description="Emission reduction targets" icon={<ArrowUp className="text-green-500" />} />

        <StatCard title="Ongoing Initiatives" value={initiatives.length.toString()} description="Active reduction programs" icon={<Users className="text-orange-500" />} />
        
        <StatCard title="Total Emissions" value={`${totalEmissions.toLocaleString(undefined, {
        maximumFractionDigits: 2
      })} tCO₂e`} description="Carbon dioxide equivalent" icon={<Cloud className="text-gray-500" />} className="md:col-span-2 lg:col-span-4" trend={{
        value: emissionsChange,
        isPositive: false
      }} />
      </div>
    </div>;
};
export default Overview;