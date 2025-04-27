
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/useAppContext';
import DataTable from '@/components/ui/data-table';
import StatCard from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Target, Initiative, Scenario } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const statusColorMap = {
  not_started: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
};

const TargetDetailPage = () => {
  const { scenarioId, targetId } = useParams();
  const navigate = useNavigate();
  const { 
    scenarios, 
    targets, 
    initiatives,
    tracks, 
    openSidePanel, 
    addTargetsToInitiative, 
    removeTargetFromInitiative,
    createInitiative
  } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [targetData, setTargetData] = useState<Target | null>(null);
  const [targetInitiatives, setTargetInitiatives] = useState<Initiative[]>([]);
  const [scenarioData, setScenarioData] = useState<Scenario | null>(null);
  
  useEffect(() => {
    if (!targetId) return;
    
    const target = targets.find(t => t.id === targetId);
    if (target) {
      setTargetData(target);
      
      // Find initiatives for this target
      const filteredInitiatives = initiatives.filter(i => i.targetIds.includes(targetId));
      setTargetInitiatives(filteredInitiatives);
      
      // Get scenario data if available
      if (scenarioId) {
        const scenario = scenarios.find(s => s.id === scenarioId);
        if (scenario) {
          setScenarioData(scenario);
        }
      }
    }
  }, [targetId, scenarioId, targets, initiatives, scenarios]);
  
  // Calculate metrics
  const totalInitiatives = targetInitiatives.length;
  const activeInitiatives = targetInitiatives.filter(i => i.status === 'in_progress').length;
  const totalSpend = targetInitiatives.reduce((sum, i) => sum + i.spend, 0);
  const totalImpact = targetInitiatives.reduce((sum, i) => sum + i.absolute, 0);
  
  const handleBack = () => {
    if (scenarioId) {
      navigate(`/scenarios/${scenarioId}`);
    } else {
      navigate('/targets');
    }
  };
  
  const filteredInitiatives = targetInitiatives.filter(initiative => 
    initiative.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
    if (!targetData) return;
    
    // Get initiatives not attached to this target
    const unattachedInitiatives = initiatives.filter(i => !i.targetIds.includes(targetData.id));
    
    if (unattachedInitiatives.length === 0) {
      toast.error("No unattached initiatives available");
      return;
    }
    
    // Show a dialog to select initiatives
    // For now, just attach the first unattached initiative
    const initiativeToAttach = unattachedInitiatives[0];
    addTargetsToInitiative(initiativeToAttach.id, [targetData.id]);
    
    toast.success(`Attached initiative: ${initiativeToAttach.name}`);
  };
  
  const handleRemoveInitiative = (initiativeId: string) => {
    if (!targetData) return;
    removeTargetFromInitiative(initiativeId, targetData.id);
    toast.success("Initiative removed from target");
  };
  
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (initiative: Initiative) => (
        <Badge 
          className={statusColorMap[initiative.status as keyof typeof statusColorMap] || ''}
          variant="outline"
        >
          {initiative.status.replace('_', ' ')}
        </Badge>
      )
    },
    {
      header: "Plan",
      accessorKey: "plan",
    },
    {
      header: "Impact",
      accessorKey: "absolute",
      cell: (initiative: Initiative) => `${initiative.absolute.toLocaleString()} tCO2e`,
    },
    {
      header: "Spend",
      accessorKey: "spend",
      cell: (initiative: Initiative) => `${initiative.spend.toLocaleString()} ${initiative.currency}`,
    },
    {
      header: "Timeframe",
      accessorKey: "period",
      cell: (initiative: Initiative) => (
        <span>
          {new Date(initiative.startDate).toLocaleDateString()} - {new Date(initiative.endDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (initiative: Initiative) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveInitiative(initiative.id);
          }}
        >
          Remove
        </Button>
      )
    }
  ];
  
  if (!targetData) {
    return <div className="p-6">Loading target details...</div>;
  }
  
  // Find track for this target
  const track = tracks.find(t => t.id === targetData.trackId);
  
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
            {scenarioData ? `Back to ${scenarioData.name}` : 'Back to Targets'}
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">
              Target: {targetData.name}
            </h1>
            {scenarioData && (
              <p className="text-muted-foreground">
                Scenario: {scenarioData.name}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEditTarget}>
            Edit Target
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Initiative
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleCreateInitiative}>
                Create new initiative
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAttachExistingInitiative}>
                Attach existing initiative
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Target Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Track</p>
                  <p className="text-lg font-medium flex items-center">
                    {track && (
                      <>
                        <span className="mr-1">{track.emoji}</span>
                        <span>{track.name}</span>
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Reduction</p>
                  <p className="text-lg font-medium">{targetData.targetPercentage}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Baseline</p>
                  <p className="text-lg font-medium">{targetData.baselineValue.toLocaleString()} tCO2e</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Value</p>
                  <p className="text-lg font-medium">{targetData.targetValue.toLocaleString()} tCO2e</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Date</p>
                  <p className="text-lg font-medium">{new Date(targetData.targetDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-medium">{targetData.status}</p>
                </div>
              </div>
              {targetData.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{targetData.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Initiatives Impact</CardTitle>
            <CardDescription>
              Current initiatives coverage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Coverage</span>
                  <span className="text-sm font-medium">
                    {targetData.targetValue > 0 
                      ? Math.min(100, Math.round((totalImpact / targetData.targetValue) * 100)) 
                      : 0}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${Math.min(100, Math.round((totalImpact / targetData.targetValue) * 100))}%` }} 
                  />
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Impact</p>
                <p className="text-2xl font-medium">
                  {totalImpact.toLocaleString()} tCO2e
                </p>
                <p className="text-sm text-muted-foreground">
                  of {targetData.targetValue.toLocaleString()} tCO2e target
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Investment</p>
                <p className="text-2xl font-medium">
                  ${totalSpend.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-medium">Initiatives ({totalInitiatives})</h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search initiatives..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <DataTable
          data={filteredInitiatives}
          columns={columns}
          onRowClick={(initiative) => openSidePanel('view', 'initiative', initiative)}
        />
      </div>
    </div>
  );
};

export default TargetDetailPage;
