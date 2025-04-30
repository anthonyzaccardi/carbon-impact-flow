
import { Track } from "@/types";
import { useAppContext } from "@/contexts/useAppContext";
import MiniBarChart from "@/components/charts/MiniBarChart";

interface TrackStatsProps {
  track: Track;
}

const TrackStats = ({
  track
}: TrackStatsProps) => {
  const {
    getTrackStats
  } = useAppContext();
  
  const trackStats = getTrackStats(track.id);
  
  // Sample data for chart
  const statsData = [
    { name: 'Factors', value: trackStats.factorsCount },
    { name: 'Data', value: trackStats.measurementsCount },
    { name: 'Targets', value: trackStats.targetsCount }
  ];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded p-3">
          <div className="text-sm text-muted-foreground">Factors</div>
          <div className="text-lg font-semibold">{trackStats.factorsCount}</div>
        </div>
        <div className="border rounded p-3">
          <div className="text-sm text-muted-foreground">Data</div>
          <div className="text-lg font-semibold">{trackStats.measurementsCount}</div>
        </div>
        <div className="border rounded p-3">
          <div className="text-sm text-muted-foreground">Targets</div>
          <div className="text-lg font-semibold">{trackStats.targetsCount}</div>
        </div>
        <div className="border rounded p-3">
          <div className="text-sm text-muted-foreground">Emissions</div>
          <div className="text-lg font-semibold">{track.totalEmissions.toLocaleString()} tCO₂e</div>
        </div>
      </div>
      
      <div className="h-[120px] mt-4 border-t pt-4">
        <h4 className="text-sm font-medium mb-2">Track Statistics</h4>
        <MiniBarChart 
          data={statsData}
          color="#9b87f5" 
          height={80} 
        />
      </div>
    </div>
  );
};

export default TrackStats;
