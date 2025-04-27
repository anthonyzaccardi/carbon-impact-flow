
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/useAppContext';
import { toast } from 'sonner';
import { ScenarioHeader } from '@/components/scenarios/ScenarioHeader';
import { ScenarioSummary } from '@/components/scenarios/ScenarioSummary';
import { ScenarioTargetsSection } from '@/components/scenarios/ScenarioTargetsSection';
import { Target, Scenario } from '@/types';

const ScenarioDetailPage = () => {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const { 
    scenarios, 
    targets, 
    tracks, 
    openSidePanel, 
    updateTarget
  } = useAppContext();
  
  const [scenarioData, setScenarioData] = useState<Scenario | null>(null);
  const [scenarioTargets, setScenarioTargets] = useState<Target[]>([]);
  
  useEffect(() => {
    if (!scenarioId) return;
    
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setScenarioData(scenario);
      const filteredTargets = targets.filter(t => t.scenarioId === scenarioId);
      setScenarioTargets(filteredTargets);
    }
  }, [scenarioId, scenarios, targets]);
  
  const handleBack = () => {
    navigate('/scenarios');
  };
  
  const handleEditScenario = () => {
    if (scenarioData) {
      openSidePanel('edit', 'scenario', scenarioData);
    }
  };
  
  const handleRowClick = (target: Target) => {
    navigate(`/scenarios/${scenarioId}/targets/${target.id}`);
  };
  
  const handleCreateTarget = () => {
    if (!scenarioData) return;
    openSidePanel('create', 'target', { scenarioId: scenarioData.id });
  };
  
  const handleAttachExistingTarget = () => {
    const unattachedTargets = targets.filter(t => !t.scenarioId);
    
    if (unattachedTargets.length === 0) {
      toast.error("No unattached targets available");
      return;
    }
    
    const targetToAttach = unattachedTargets[0];
    updateTarget(targetToAttach.id, { 
      ...targetToAttach, 
      scenarioId: scenarioId 
    });
    
    toast.success(`Attached target: ${targetToAttach.name}`);
  };
  
  const handleRemoveTarget = (targetId: string) => {
    const target = targets.find(t => t.id === targetId);
    if (target) {
      updateTarget(targetId, { ...target, scenarioId: undefined });
      toast.success("Target removed from scenario");
    }
  };
  
  if (!scenarioData) {
    return <div className="p-6">Loading scenario details...</div>;
  }
  
  return (
    <div className="space-y-6">
      <ScenarioHeader
        scenario={scenarioData}
        onBack={handleBack}
        onEdit={handleEditScenario}
      />
      
      <ScenarioSummary targets={scenarioTargets} />
      
      <ScenarioTargetsSection
        targets={scenarioTargets}
        tracks={tracks}
        onCreateTarget={handleCreateTarget}
        onAttachExisting={handleAttachExistingTarget}
        onRemoveTarget={handleRemoveTarget}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default ScenarioDetailPage;
