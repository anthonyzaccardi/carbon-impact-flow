
import { useAppContext } from "@/contexts/useAppContext";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import StatCard from "@/components/ui/stat-card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FeaturedScenarios } from "@/components/scenarios/FeaturedScenarios";
import PageLayout from "@/components/layout/PageLayout";

const ScenariosPage = () => {
  const { scenarios, targets, tracks, openSidePanel } = useAppContext();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  
  // Apply filters
  const filteredScenarios = scenarios.filter(scenario => 
    scenario.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get scenario stats
  const getScenarioStats = (scenarioId: string) => {
    const scenarioTargets = targets.filter(t => t.scenarioId === scenarioId);
    const totalTargets = scenarioTargets.length;
    const totalReduction = scenarioTargets.reduce(
      (sum, target) => sum + (target.baselineValue - target.targetValue), 
      0
    );
    const uniqueTracks = new Set(scenarioTargets.map(t => t.trackId)).size;
    
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
  
  // Handle row click - navigate to scenario detail page
  const handleRowClick = (scenario) => {
    navigate(`/scenarios/${scenario.id}`);
  };
  
  // Handle create new
  const handleCreateNew = () => {
    openSidePanel('create', 'scenario');
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
      header: "Total reduction",
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

  return (
    <PageLayout
      title="Scenarios"
      description="Create and manage planning scenarios"
      breadcrumbItems={[
        { label: "Dashboard", href: "/" },
        { label: "Scenarios" }
      ]}
    >
      <div className="flex justify-end mb-6">
        <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add scenario
        </Button>
      </div>
  
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total scenarios" 
          value={scenarios.length}
        />
        <StatCard 
          title="Scenario targets" 
          value={targets.filter(t => t.scenarioId).length}
        />
        <StatCard 
          title="Total reduction" 
          value={`${targets.filter(t => t.scenarioId).reduce(
            (sum, t) => sum + (t.baselineValue - t.targetValue), 0
          ).toLocaleString()} tCO2e`}
        />
      </div>
  
      {/* Featured Scenarios */}
      <FeaturedScenarios
        scenarios={scenarios}
        onScenarioClick={handleRowClick}
      />
  
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 my-6">
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
    </PageLayout>
  );
};

export default ScenariosPage;
