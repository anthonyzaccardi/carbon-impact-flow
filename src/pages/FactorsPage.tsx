
import { useAppContext } from "@/contexts/useAppContext";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
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
import { useState } from "react";

const FactorsPage = () => {
  const { factors, tracks, measurements, openSidePanel } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [trackFilter, setTrackFilter] = useState("all");
  
  // Apply filters
  const filteredFactors = factors.filter(factor => {
    const matchesSearch = 
      factor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factor.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTrack = trackFilter === "all" || factor.trackId === trackFilter;
    
    return matchesSearch && matchesTrack;
  });
  
  // Metrics
  const totalFactors = factors.length;
  const categories = [...new Set(factors.map(factor => factor.category))].length;
  
  // Count measurements for each factor
  const getMeasurementsCount = (factorId: string) => {
    return measurements.filter(m => m.factorId === factorId).length;
  };
  
  // Table columns
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
      header: "Value",
      accessorKey: "value",
      cell: (item) => `${item.value} ${item.unit}`,
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Measurements",
      accessorKey: "measurements",
      cell: (item) => getMeasurementsCount(item.id),
    }
  ];

  // Handle row click
  const handleRowClick = (factor) => {
    openSidePanel('view', 'factor', factor);
  };
  
  // Handle create new
  const handleCreateNew = () => {
    openSidePanel('create', 'factor');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Emission Factors</h1>
          <p className="text-muted-foreground">
            Manage conversion factors for emission calculations
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Factor
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Factors" 
          value={totalFactors}
        />
        <StatCard 
          title="Categories" 
          value={categories}
        />
        <StatCard 
          title="Total Measurements" 
          value={measurements.length}
        />
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search factors..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={trackFilter}
          onValueChange={setTrackFilter}
        >
          <SelectTrigger className="w-full md:w-[200px]">
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
      </div>
      
      {/* Factors Table */}
      <DataTable 
        data={filteredFactors} 
        columns={columns} 
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default FactorsPage;
