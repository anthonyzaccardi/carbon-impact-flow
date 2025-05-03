
import { useEffect } from 'react';
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
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const {
          tracks,
          factors,
          measurements,
          targets,
          initiatives,
          scenarios,
          suppliers
        } = await fetchAllData();

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
      }
    };

    loadAllData();
  }, [setTracks, setFactors, setMeasurements, setTargets, setInitiatives, setScenarios, setSuppliers]);
}
