
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/useAppContext';
import DataTable from '@/components/ui/data-table';
import StatCard from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Target, Scenario } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const ScenarioDetailPage = () => {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const { 
    scenarios, 
    targets, 
    tracks, 
    openSidePanel, 
    updateTarget, 
    createTarget 
  } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState("");
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
  
  // Calculate metrics
  const totalTargets = scenarioTargets.length;
  const totalBaseline = scenarioTargets.reduce((sum, t) => sum + t.baselineValue, 0);
  const totalReduction = scenarioTargets.reduce((sum, t) => sum + (t.baselineValue - t.targetValue), 0);
  const reductionPercentage = totalBaseline > 0 ? ((totalReduction / totalBaseline) * 100).toFixed(1) : '0';
  
  const handleBack = () => {
    navigate('/scenarios');
  };
  
  const filteredTargets = scenarioTargets.filter(target => 
    target.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
    // Get targets not attached to this scenario
    const unattachedTargets = targets.filter(t => !t.scenarioId);
    
    if (unattachedTargets.length === 0) {
      toast.error("No unattached targets available");
      return;
    }
    
    // Show a dialog to select targets
    // For now, just attach the first unattached target
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
  
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Track",
      accessorKey: "trackId",
      cell: (target: Target) => {
        const track = tracks.find(t => t.id === target.trackId);
        return track ? (
          <div className="flex items-center">
            <span className="mr-1">{track.emoji}</span>
            <span>{track.name}</span>
          </div>
        ) : target.trackId;
      }
    },
    {
      header: "Target",
      accessorKey: "targetPercentage",
      cell: (target: Target) => `${target.targetPercentage}% reduction`,
    },
    {
      header: "Baseline",
      accessorKey: "baselineValue",
      cell: (target: Target) => `${target.baselineValue.toLocaleString()} tCO2e`,
    },
    {
      header: "Target Value",
      accessorKey: "targetValue",
      cell: (target: Target) => `${target.targetValue.toLocaleString()} tCO2e`,
    },
    {
      header: "Target Date",
      accessorKey: "targetDate",
      cell: (target: Target) => new Date(target.targetDate).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (target: Target) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveTarget(target.id);
          }}
        >
          Remove
        </Button>
      )
    }
  ];
  
  if (!scenarioData) {
    return <div className="p-6">Loading scenario details...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2" 
            onClick={handleBack}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Scenarios
          </Button>
          <h1 className="text-2xl font-semibold">
            Scenario: {scenarioData.name}
          </h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEditScenario}>
            Edit Scenario
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Target
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleCreateTarget}>
                Create new target
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAttachExistingTarget}>
                Attach existing target
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Scenario Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard 
              title="Total Targets" 
              value={totalTargets}
            />
            <StatCard 
              title="Total Baseline" 
              value={`${totalBaseline.toLocaleString()} tCO2e`}
            />
            <StatCard 
              title="Total Reduction" 
              value={`${totalReduction.toLocaleString()} tCO2e`}
            />
            <StatCard 
              title="Reduction Percentage" 
              value={`${reductionPercentage}%`}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search targets..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <DataTable
        data={filteredTargets}
        columns={columns}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default ScenarioDetailPage;
