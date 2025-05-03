
import { useEffect } from 'react';
import { fetchAllData } from '@/services/supabase/dataService';
import { toast } from 'sonner';

export function useSupabaseData(
  setTracks: (tracks: any[]) => void,
  setFactors: (factors: any[]) => void,
  setMeasurements: (measurements: any[]) => void,
  setTargets: (targets: any[]) => void,
  setInitiatives: (initiatives: any[]) => void,
  setScenarios: (scenarios: any[]) => void,
  setSuppliers: (suppliers: any[]) => void,
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
