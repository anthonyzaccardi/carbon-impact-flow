import { Track } from "@/types";
import { useAppContext } from "@/contexts/useAppContext";
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
  return <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
    </div>;
};
export default TrackStats;