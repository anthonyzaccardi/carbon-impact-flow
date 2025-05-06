
import { useEffect, useState } from 'react';
import { fetchAllData } from '@/services/supabase/dataService';
import { toast } from 'sonner';
import { Track, Factor, Measurement, Target, Initiative, Scenario, Supplier } from '@/types';

export function useSupabaseData(
  setTracks: (tracks: Track[]) => void,
  setFactors: (factors: Factor[]) => void,
  setMeasurements: (measurements: Measurement[]) => void,
  setTargets: (targets: Target[]) => void,
  setInitiatives: (initiatives: Initiative[]) => void,
  setScenarios: (scenarios: Scenario[]) => void,
  setSuppliers: (suppliers: Supplier[]) => void,
) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const {
          tracks,
          factors,
          measurements,
          targets,
          initiatives,
          scenarios,
          suppliers
        } = await fetchAllData();

        console.log("Loaded scenarios from Supabase:", scenarios);

        setTracks(tracks);
        setFactors(factors);
        setMeasurements(measurements);
        setTargets(targets);
        setInitiatives(initiatives);
        setScenarios(scenarios);
        setSuppliers(suppliers);

      } catch (error) {
        console.error("Failed to load application data:", error);
        toast.error("Failed to load application data");
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [setTracks, setFactors, setMeasurements, setTargets, setInitiatives, setScenarios, setSuppliers]);

  return { loading };
}
