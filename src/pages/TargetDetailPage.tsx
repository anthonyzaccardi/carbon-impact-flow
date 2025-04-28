import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/useAppContext';
import { toast } from 'sonner';
import { ExistingInitiativesSelector } from '@/components/targets/initiatives/ExistingInitiativesSelector';
import { TargetHeader } from '@/components/targets/detail/TargetHeader';
import { TargetSummary } from '@/components/targets/detail/TargetSummary';
import { TargetInitiatives } from '@/components/targets/detail/TargetInitiatives';
import { useInitiativeMetrics } from '@/hooks/useInitiativeMetrics';
import { Target, Initiative, Scenario } from '@/types';

const TargetDetailPage = () => {
  const { scenarioId, targetId } = useParams();
  const navigate = useNavigate();
  const { 
    scenarios, 
    targets, 
    initiatives,
    tracks, 
    openSidePanel,
    removeTargetFromInitiative
  } = useAppContext();
  
  const [targetData, setTargetData] = useState<Target | null>(null);
  const [targetInitiatives, setTargetInitiatives] = useState<Initiative[]>([]);
  const [scenarioData, setScenarioData] = useState<Scenario | null>(null);
  
  useEffect(() => {
    if (!targetId) return;
    
    const target = targets.find(t => t.id === targetId);
    if (target) {
      setTargetData(target);
      
      const filteredInitiatives = initiatives.filter(i => i.targetIds.includes(targetId));
      setTargetInitiatives(filteredInitiatives);
      
      if (scenarioId) {
        const scenario = scenarios.find(s => s.id === scenarioId);
        if (scenario) {
          setScenarioData(scenario);
        }
      }
    }
  }, [targetId, scenarioId, targets, initiatives, scenarios]);
  
  if (!targetData) {
    return <div className="p-6">Loading target details...</div>;
  }
  
  const { totalInitiatives, activeInitiatives, totalSpend, totalImpact } = useInitiativeMetrics(targetInitiatives);
  
  const track = tracks.find(t => t.id === targetData.trackId);
  
  const handleBack = () => {
    if (scenarioId) {
      navigate(`/scenarios/${scenarioId}`);
    } else {
      navigate('/targets');
    }
  };
  
  const handleEditTarget = () => {
    if (targetData) {
      openSidePanel('edit', 'target', targetData);
    }
  };
  
  const handleCreateInitiative = () => {
    if (!targetData) return;
    
    openSidePanel('create', 'initiative', { 
      targetIds: [targetData.id] 
    });
  };
  
  const handleAttachExistingInitiative = () => {
    if (!targetId) return;
    
    openSidePanel('view', 'custom', {
      title: "Attach Existing Initiatives",
      content: (
        <ExistingInitiativesSelector
          targetId={targetId}
          onClose={() => openSidePanel('view', 'custom', { isOpen: false })}
        />
      ),
    });
  };
  
  const handleRemoveInitiative = (initiativeId: string) => {
    if (!targetData) return;
    removeTargetFromInitiative(initiativeId, targetData.id);
    toast.success("Initiative removed from target");
  };

  return (
    <div className="space-y-6">
      <TargetHeader
        target={targetData}
        scenario={scenarioData}
        onBack={handleBack}
        onEditTarget={handleEditTarget}
        onCreateInitiative={handleCreateInitiative}
        onAttachExistingInitiative={handleAttachExistingInitiative}
      />
      
      <TargetSummary 
        target={targetData}
        track={track}
        totalImpact={totalImpact}
        totalSpend={totalSpend}
      />
      
      <TargetInitiatives
        initiatives={targetInitiatives}
        onCreateInitiative={handleCreateInitiative}
        onAttachExistingInitiative={handleAttachExistingInitiative}
        onRemoveInitiative={handleRemoveInitiative}
        onInitiativeClick={(initiative) => openSidePanel('view', 'initiative', initiative)}
      />
    </div>
  );
};

export default TargetDetailPage;
