
import { fetchTracks } from './trackService';
import { fetchFactors } from './factorService';
import { fetchMeasurements } from './measurementService';
import { fetchTargets } from './targetService';
import { fetchInitiatives } from './initiative';
import { fetchScenarios } from './scenarioService';
import { fetchSuppliers } from './supplierService';
import { supabase } from '@/integrations/supabase/client';

export async function fetchAllData() {
  try {
    // Fetch all data in parallel
    const [
      tracks,
      factors,
      measurements,
      targets,
      initiatives,
      scenarios,
      suppliers
    ] = await Promise.all([
      fetchTracks(),
      fetchFactors(),
      fetchMeasurements(),
      fetchTargets(),
      fetchInitiatives(),
      fetchScenarios(),
      fetchSuppliers()
    ]);

    // Also check if the dashboard_layouts table exists by querying it
    try {
      const { data } = await supabase
        .from('dashboard_layouts')
        .select('*')
        .limit(1);
      
      console.log("Dashboard layouts table exists:", data && data.length > 0);
    } catch (error) {
      console.error("Error checking dashboard_layouts table:", error);
    }

    return {
      tracks,
      factors,
      measurements,
      targets,
      initiatives,
      scenarios,
      suppliers
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
