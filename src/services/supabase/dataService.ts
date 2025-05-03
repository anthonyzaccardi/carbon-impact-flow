
import { fetchTracks } from './trackService';
import { fetchFactors } from './factorService';
import { fetchMeasurements } from './measurementService';
import { fetchTargets } from './targetService';
import { fetchInitiatives } from './initiativeService';
import { fetchScenarios } from './scenarioService';
import { fetchSuppliers } from './supplierService';

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
