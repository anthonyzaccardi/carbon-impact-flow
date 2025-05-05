
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/useAppContext';
import { Target, Scenario } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SortableTable } from '@/components/ui/sortable-table';
import { cn } from '@/lib/utils';

interface ScenarioTargetAttachmentManagerProps {
  targetId: string;
  onClose: () => void;
}

export const ScenarioTargetAttachmentManager: React.FC<ScenarioTargetAttachmentManagerProps> = ({
  targetId,
  onClose,
}) => {
  const { scenarios, targets, updateTarget } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  
  const target = targets.find(t => t.id === targetId);
  
  // Initialize the selected scenario if the target is already attached to one
  useEffect(() => {
    if (target?.scenarioId) {
      setSelectedScenarioId(target.scenarioId);
    }
  }, [target]);

  // Apply search filter
  const filteredScenarios = scenarios.filter(
    scenario => scenario.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId === selectedScenarioId ? null : scenarioId);
  };

  const handleSave = () => {
    if (target) {
      updateTarget(targetId, { ...target, scenarioId: selectedScenarioId || undefined });
      onClose();
    }
  };

  const columns = [
    {
      header: '',
      cell: (scenario: Scenario) => (
        <Checkbox 
          checked={selectedScenarioId === scenario.id}
          onCheckedChange={() => handleSelectScenario(scenario.id)}
          className="pointer-events-none" // Prevent event conflict with row click
        />
      ),
      sortable: false
    },
    {
      header: 'Name',
      accessorKey: 'name' as keyof Scenario
    },
    {
      header: 'Total Targets',
      cell: (scenario: Scenario) => {
        const scenarioTargets = targets.filter(t => t.scenarioId === scenario.id);
        return scenarioTargets.length;
      },
      accessorKey: 'id' as keyof Scenario
    },
    {
      header: 'Created',
      cell: (scenario: Scenario) => new Date(scenario.createdAt).toLocaleDateString(),
      accessorKey: 'createdAt' as keyof Scenario
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Manage Scenario</h2>
      <p className="text-sm text-muted-foreground">Select a scenario to associate with this target or leave empty to detach from all scenarios.</p>
      
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search scenarios..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredScenarios.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery ? "No scenarios match your search" : "No scenarios available"}
        </div>
      ) : (
        <div className="max-h-[60vh] overflow-y-auto">
          <SortableTable
            data={filteredScenarios}
            columns={columns}
            onRowClick={(scenario) => handleSelectScenario(scenario.id)}
          />
        </div>
      )}
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};
