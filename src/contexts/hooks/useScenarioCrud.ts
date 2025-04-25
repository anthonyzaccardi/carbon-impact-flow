
import { Scenario, Target } from '@/types';
import { createScenarioOperation, updateScenarioOperation, deleteScenarioOperation } from '../operations';

export const useScenarioCrud = (
  scenarios: Scenario[],
  setScenarios: (scenarios: Scenario[]) => void,
  targets: Target[],
  setTargets: (targets: Target[]) => void
) => {
  const createScenario = (scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>) => {
    createScenarioOperation(scenarios, setScenarios, targets, setTargets, scenario);
  };

  const updateScenario = (id: string, scenario: Partial<Scenario>) => {
    updateScenarioOperation(scenarios, setScenarios, id, scenario);
  };

  const deleteScenario = (id: string) => {
    deleteScenarioOperation(scenarios, setScenarios, targets, setTargets, id);
  };

  return {
    createScenario,
    updateScenario,
    deleteScenario
  };
};
