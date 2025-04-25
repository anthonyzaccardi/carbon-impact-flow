
import { toast } from 'sonner';
import { Scenario, Target } from '@/types';
import { generateId, getCurrentTimestamp } from '../utils';

export const createScenarioOperation = (
  scenarios: Scenario[],
  setScenarios: (scenarios: Scenario[]) => void,
  scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const newScenario: Scenario = {
    ...scenario,
    id: generateId('scenario'),
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  };
  setScenarios([...scenarios, newScenario]);
  toast.success(`Created scenario: ${scenario.name}`);
};

export const updateScenarioOperation = (
  scenarios: Scenario[],
  setScenarios: (scenarios: Scenario[]) => void,
  id: string,
  scenario: Partial<Scenario>
) => {
  setScenarios(scenarios.map(s =>
    s.id === id ? { ...s, ...scenario, updatedAt: getCurrentTimestamp() } : s
  ));
  toast.success(`Updated scenario: ${scenario.name || id}`);
};

export const deleteScenarioOperation = (
  scenarios: Scenario[],
  setScenarios: (scenarios: Scenario[]) => void,
  targets: Target[],
  setTargets: (targets: Target[]) => void,
  id: string
) => {
  const updatedTargets = targets.map(target => 
    target.scenarioId === id ? { ...target, scenarioId: undefined } : target
  );
  setTargets(updatedTargets);
  
  setScenarios(scenarios.filter(s => s.id !== id));
  toast.success(`Deleted scenario: ${id}`);
};
