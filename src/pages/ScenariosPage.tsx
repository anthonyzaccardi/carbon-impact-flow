
import { useAppContext } from "@/contexts/useAppContext";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import StatCard from "@/components/ui/stat-card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const ScenariosPage = () => {
  const { scenarios, targets, tracks, openSidePanel } = useAppContext();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  
  // Apply filters
  const filteredScenarios = scenarios.filter(scenario => 
    scenario.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Metrics
  const totalScenarios = scenarios.length;
  
  // Calculate targets and reductions by scenario
  const getScenarioStats = (scenarioId) => {
    const scenarioTargets = targets.filter(t => t.scenarioId === scenarioId);
    const totalTargets = scenarioTargets.length;
    const totalReduction = scenarioTargets.reduce(
      (sum, target) => sum + (target.baselineValue - target.targetValue), 
      0
    );
    const uniqueTracks = new Set(scenarioTargets.map(t => t.trackId)).size;
    
    // Calculate scenario dates from the targets
    const startDates = scenarioTargets.map(t => new Date(t.targetDate).getFullYear());
    const minYear = startDates.length > 0 ? Math.min(...startDates) : null;
    const maxYear = startDates.length > 0 ? Math.max(...startDates) : null;
    
    return { 
      totalTargets, 
      totalReduction, 
      uniqueTracks,
      startYear: minYear,
      endYear: maxYear
    };
  };
  
  // Table columns
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Targets",
      accessorKey: "id",
      cell: (item) => getScenarioStats(item.id).totalTargets,
    },
    {
      header: "Tracks",
      accessorKey: "tracks",
      cell: (item) => getScenarioStats(item.id).uniqueTracks,
    },
    {
      header: "Total Reduction",
      accessorKey: "reduction",
      cell: (item) => `${getScenarioStats(item.id).totalReduction.toLocaleString()} tCO2e`,
    },
    {
      header: "Period",
      accessorKey: "period",
      cell: (item) => {
        const stats = getScenarioStats(item.id);
        return stats.startYear && stats.endYear ? 
          `${stats.startYear} - ${stats.endYear}` : 
          "—";
      },
    }
  ];

  // Handle row click - navigate to scenario detail page
  const handleRowClick = (scenario) => {
    navigate(`/scenarios/${scenario.id}`);
  };
  
  // Handle create new
  const handleCreateNew = () => {
    openSidePanel('create', 'scenario');
  };
  
  // Get scenario cards data
  const scenarioCards = scenarios.slice(0, 3).map(scenario => {
    const stats = getScenarioStats(scenario.id);
    const scenarioTargets = targets.filter(t => t.scenarioId === scenario.id);
    
    // Group targets by track
    const trackGroups = {};
    scenarioTargets.forEach(target => {
      if (!trackGroups[target.trackId]) {
        trackGroups[target.trackId] = {
          track: tracks.find(t => t.id === target.trackId),
          targets: [],
          totalReduction: 0
        };
      }
      trackGroups[target.trackId].targets.push(target);
      trackGroups[target.trackId].totalReduction += 
        (target.baselineValue - target.targetValue);
    });
    
    return {
      scenario,
      stats,
      trackGroups: Object.values(trackGroups)
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Scenarios</h1>
          <p className="text-muted-foreground">
            Create and manage planning scenarios
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Scenario
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          title="Total Scenarios" 
          value={totalScenarios}
        />
        <StatCard 
          title="Scenario Targets" 
          value={targets.filter(t => t.scenarioId).length}
        />
        <StatCard 
          title="Total Reduction" 
          value={`${targets.filter(t => t.scenarioId).reduce(
            (sum, t) => sum + (t.baselineValue - t.targetValue), 0
          ).toLocaleString()} tCO2e`}
        />
      </div>
      
      {/* Scenario Cards */}
      {scenarioCards.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {scenarioCards.map(({ scenario, stats, trackGroups }) => (
            <Card 
              key={scenario.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleRowClick(scenario)}
            >
              <CardHeader>
                <CardTitle>{scenario.name}</CardTitle>
                <CardDescription>
                  {stats.startYear && stats.endYear ? 
                    `${stats.startYear} - ${stats.endYear}` : 
                    "No targets"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Targets:</div>
                    {trackGroups.length > 0 ? (
                      <ul className="space-y-2">
                        {trackGroups.map(({ track, totalReduction }) => track && (
                          <li key={track.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <span className="mr-1">{track.emoji}</span>
                              <span>{track.name}</span>
                            </div>
                            <span className="text-green-500">
                              -{totalReduction.toLocaleString()} tCO2e
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No targets assigned</p>
                    )}
                  </div>
                  
                  <div className="pt-2 mt-2 border-t flex justify-between text-sm">
                    <span>Total Reduction:</span>
                    <span className="font-bold">{stats.totalReduction.toLocaleString()} tCO2e</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search scenarios..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Scenarios Table */}
      <DataTable 
        data={filteredScenarios} 
        columns={columns} 
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default ScenariosPage;
