
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/useAppContext';
import { Target, Scenario } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SortableTable } from '@/components/ui/sortable-table';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ScenarioTargetAttachmentManagerProps {
  targetId: string;
  onClose: () => void;
}

export const ScenarioTargetAttachmentManager: React.FC<ScenarioTargetAttachmentManagerProps> = ({
  targetId,
  onClose,
}) => {
  const { scenarios, targets, updateTarget, refreshScenarios } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const target = targets.find(t => t.id === targetId);
  
  // Load scenarios when the component mounts
  useEffect(() => {
    const loadScenarios = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await refreshScenarios();
        console.log("Loaded scenarios:", scenarios);
      } catch (err) {
        console.error("Error loading scenarios:", err);
        setError("Failed to load scenarios. Please try again.");
        toast.error("Failed to load scenarios");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadScenarios();
  }, [refreshScenarios]);

  // Initialize the selected scenario if the target is already attached to one
  useEffect(() => {
    if (target?.scenarioId) {
      setSelectedScenarioId(target.scenarioId);
      console.log("Target is attached to scenario:", target.scenarioId);
    }
  }, [target]);

  // Apply search filter
  const filteredScenarios = scenarios.filter(
    scenario => scenario.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId === selectedScenarioId ? null : scenarioId);
  };

  const handleSave = async () => {
    if (!target) return;
    
    setIsLoading(true);
    try {
      await updateTarget(targetId, { ...target, scenarioId: selectedScenarioId || undefined });
      toast.success("Target association updated successfully");
      onClose();
    } catch (err) {
      console.error("Error updating target:", err);
      toast.error("Failed to update target association");
    } finally {
      setIsLoading(false);
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

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Loading scenarios...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          {error}
          <Button variant="outline" className="mt-2 mx-auto block" onClick={() => refreshScenarios()}>
            Retry
          </Button>
        </div>
      ) : filteredScenarios.length === 0 ? (
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
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Save
        </Button>
      </div>
    </div>
  );
};
