
import { useAppContext } from "@/contexts/useAppContext";
import StatCard from "@/components/ui/stat-card";
import { Activity, ArrowUp, Users, Calendar, Cloud, Info } from "lucide-react";
import { useState } from "react";

const Overview = () => {
  const {
    tracks,
    measurements,
    targets,
    initiatives
  } = useAppContext();
  
  const [dateRange, setDateRange] = useState("May 29, 2024 - Jun 4, 2024");
  
  const totalEmissions = tracks.reduce((sum, track) => {
    const trackMeasurements = measurements.filter(m => m.trackId === track.id);
    const trackEmissions = trackMeasurements.reduce((trackSum, measurement) => trackSum + measurement.calculatedValue, 0);
    return sum + trackEmissions;
  }, 0);
  
  const emissionsChange = -5.2; // Example trend, replace with actual calculation if needed

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[22px] font-semibold text-[#333336]">Overview</h1>
        
        <button className="flex items-center border border-[#EEEEEE] rounded-lg px-3 py-1.5 text-sm text-[#333336]">
          <Calendar className="h-4 w-4 mr-2 text-[#717175]" />
          {dateRange}
          <ArrowUp className="h-4 w-4 ml-2 text-[#717175] rotate-180" />
        </button>
      </div>

      <h2 className="text-base font-semibold text-[#333336] mb-4">Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Tracks" 
          value={tracks.length.toString()} 
          description="Active emission categories" 
          icon={<Activity className="h-5 w-5" />} 
        />

        <StatCard 
          title="Active Measurements" 
          value={measurements.length.toString()} 
          description="Total recorded measurements" 
          icon={<Calendar className="h-5 w-5" />} 
        />

        <StatCard 
          title="Set Targets" 
          value={targets.length.toString()} 
          description="Emission reduction targets" 
          icon={<ArrowUp className="h-5 w-5" />} 
        />

        <StatCard 
          title="Ongoing Initiatives" 
          value={initiatives.length.toString()} 
          description="Active reduction programs" 
          icon={<Users className="h-5 w-5" />} 
        />
      </div>
      
      <div className="border border-[#EEEEEE] rounded-lg p-5 bg-white mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h3 className="text-base font-semibold text-[#333336]">Total Emissions</h3>
            <button className="ml-1 text-[#717175]">
              <Info className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-baseline">
          <div className="text-2xl font-semibold text-[#333336]">
            {totalEmissions.toLocaleString(undefined, {
              maximumFractionDigits: 2
            })} tCO₂e
          </div>
          
          <div className={`ml-4 text-sm ${emissionsChange < 0 ? 'text-[#1FCC83]' : 'text-[#D64141]'}`}>
            {emissionsChange < 0 ? '' : '+'}{emissionsChange}%
            <span className="ml-1 text-xs text-[#71717A]">—</span>
            <span className="ml-1 text-xs text-[#71717A]">vs previous period</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
