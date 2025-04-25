
import { useState } from 'react';
import { Track, Factor, Measurement, Target, Initiative, Scenario, Supplier } from '@/types';
import { tracks as initialTracks, factors as initialFactors, measurements as initialMeasurements, targets as initialTargets, initiatives as initialInitiatives, scenarios as initialScenarios, suppliers as initialSuppliers } from '@/data/sample-data';

export const useEntityState = () => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks.map(track => ({
    ...track,
    totalEmissions: 0
  })));
  const [factors, setFactors] = useState<Factor[]>(initialFactors);
  const [measurements, setMeasurements] = useState<Measurement[]>(initialMeasurements);
  const [targets, setTargets] = useState<Target[]>(initialTargets);
  const [initiatives, setInitiatives] = useState<Initiative[]>(initialInitiatives);
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);

  return {
    tracks,
    setTracks,
    factors,
    setFactors,
    measurements,
    setMeasurements,
    targets,
    setTargets,
    initiatives,
    setInitiatives,
    scenarios,
    setScenarios,
    suppliers,
    setSuppliers,
  };
};
