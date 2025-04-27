
import { useAppContext } from "@/contexts/useAppContext";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import StatCard from "@/components/ui/stat-card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";

const TargetsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { targets, tracks, scenarios, suppliers, openSidePanel } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [trackFilter, setTrackFilter] = useState("all");
  const [scenarioFilter, setScenarioFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  
  // Parse URL query params for scenario filter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scenarioParam = params.get('scenario');
    if (scenarioParam) {
      setScenarioFilter(scenarioParam);
    }
  }, [location]);
  
  const filteredTargets = targets.filter(target => {
    const matchesSearch = 
      target.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTrack = trackFilter === "all" || target.trackId === trackFilter;
    
    const matchesScenario = scenarioFilter === "all" || 
      (scenarioFilter === "none" && !target.scenarioId) ||
      target.scenarioId === scenarioFilter;
    
    const matchesSupplier = supplierFilter === "all" ||
      (supplierFilter === "none" && !target.supplierId) ||
      target.supplierId === supplierFilter;
    
    return matchesSearch && matchesTrack && matchesScenario && matchesSupplier;
  });
  
  const totalTargets = targets.length;
  const activeTargets = targets.filter(target => target.status === 'active').length;
  const totalBaseline = targets.reduce((sum, t) => sum + t.baselineValue, 0);
  const totalReduction = targets.reduce((sum, t) => sum + (t.baselineValue - t.targetValue), 0);
  const averageReduction = targets.length > 0 ? 
    targets.reduce((sum, t) => sum + t.targetPercentage, 0) / targets.length : 0;
  
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Track",
      accessorKey: "trackId",
      cell: (item) => {
        const track = tracks.find(t => t.id === item.trackId);
        return track ? (
          <div className="flex items-center">
            <span className="mr-1">{track.emoji}</span>
            <span>{track.name}</span>
          </div>
        ) : item.trackId;
      }
    },
    {
      header: "Supplier",
      accessorKey: "supplierId",
      cell: (item) => {
        if (!item.supplierId) return "—";
        const supplier = suppliers.find(s => s.id === item.supplierId);
        return supplier ? supplier.name : item.supplierId;
      }
    },
    {
      header: "Scenario",
      accessorKey: "scenarioId",
      cell: (item) => {
        if (!item.scenarioId) return "—";
        const scenario = scenarios.find(s => s.id === item.scenarioId);
        return scenario ? scenario.name : item.scenarioId;
      }
    },
    {
      header: "Target",
      accessorKey: "targetPercentage",
      cell: (item) => `${item.targetPercentage}% reduction`,
    },
    {
      header: "Target Date",
      accessorKey: "targetDate",
      cell: (item) => new Date(item.targetDate).toLocaleDateString(),
    },
    {
      header: "Status",
      accessorKey: "status",
    }
  ];

  const handleRowClick = (target) => {
    if (target.scenarioId) {
      navigate(`/scenarios/${target.scenarioId}/targets/${target.id}`);
    } else {
      openSidePanel('view', 'target', target);
    }
  };
  
  const handleCreateNew = () => {
    openSidePanel('create', 'target');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Reduction Targets</h1>
          <p className="text-muted-foreground">
            Set and track emission reduction goals
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Target
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Targets" 
          value={totalTargets}
        />
        <StatCard 
          title="Active Targets" 
          value={activeTargets}
        />
        <StatCard 
          title="Average Reduction" 
          value={`${averageReduction.toFixed(1)}%`}
        />
        <StatCard 
          title="Total Planned Reduction" 
          value={`${totalReduction.toLocaleString()} tCO2e`}
        />
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Reduction Summary</h3>
            <div className="flex items-center space-x-4 flex-wrap md:flex-nowrap">
              <div>
                <span className="text-2xl font-bold">{totalBaseline.toLocaleString()}</span>
                <span className="text-muted-foreground ml-1">tCO2e</span>
                <div className="text-sm text-muted-foreground">Baseline</div>
              </div>
              <div className="text-2xl">→</div>
              <div>
                <span className="text-2xl font-bold">{(totalBaseline - totalReduction).toLocaleString()}</span>
                <span className="text-muted-foreground ml-1">tCO2e</span>
                <div className="text-sm text-muted-foreground">Target</div>
              </div>
              <div className="text-2xl">=</div>
              <div>
                <span className="text-2xl font-bold text-green-500">-{totalReduction.toLocaleString()}</span>
                <span className="text-muted-foreground ml-1">tCO2e</span>
                <div className="text-sm text-muted-foreground">Reduction</div>
              </div>
              <div className="text-2xl">(</div>
              <div>
                <span className="text-2xl font-bold text-green-500">
                  -{totalBaseline > 0 ? ((totalReduction / totalBaseline) * 100).toFixed(1) : 0}%
                </span>
                <div className="text-sm text-muted-foreground">Overall</div>
              </div>
              <div className="text-2xl">)</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search targets..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={trackFilter}
          onValueChange={setTrackFilter}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by track" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tracks</SelectItem>
            {tracks.map((track) => (
              <SelectItem key={track.id} value={track.id}>
                {track.emoji} {track.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={scenarioFilter}
          onValueChange={(value) => {
            setScenarioFilter(value);
            // Update URL if scenario filter changes
            if (value === "all") {
              navigate('/targets');
            } else {
              navigate(`/targets?scenario=${value}`);
            }
          }}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by scenario" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scenarios</SelectItem>
            <SelectItem value="none">No Scenario</SelectItem>
            {scenarios.map((scenario) => (
              <SelectItem key={scenario.id} value={scenario.id}>
                {scenario.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={supplierFilter}
          onValueChange={setSupplierFilter}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Suppliers</SelectItem>
            <SelectItem value="none">No Supplier</SelectItem>
            {suppliers.map((supplier) => (
              <SelectItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <DataTable 
        data={filteredTargets} 
        columns={columns} 
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default TargetsPage;
