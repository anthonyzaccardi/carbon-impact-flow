import { useAppContext } from "@/contexts/useAppContext";

const Overview = () => {
  const { tracks, measurements, targets, initiatives } = useAppContext();
  
  const totalEmissions = tracks.reduce((sum, track) => {
    const trackMeasurements = measurements.filter(m => m.trackId === track.id);
    const trackEmissions = trackMeasurements.reduce((trackSum, measurement) => trackSum + measurement.calculatedValue, 0);
    return sum + trackEmissions;
  }, 0);
  
  return (
    <div>
      <h2>Overview</h2>
      <p>Total Tracks: {tracks.length}</p>
      <p>Total Measurements: {measurements.length}</p>
      <p>Total Targets: {targets.length}</p>
      <p>Total Initiatives: {initiatives.length}</p>
      <p>Emissions: {totalEmissions.toFixed(2)} tCO₂e</p>
    </div>
  );
};

export default Overview;
