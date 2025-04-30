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
import { useState } from "react";

const MeasurementsPage = () => {
  const { measurements, tracks, factors, suppliers, openSidePanel } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [trackFilter, setTrackFilter] = useState("all");
  
  const filteredMeasurements = measurements.filter(measurement => {
    const matchesSearch = searchTerm === "" || 
      measurement.unit.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTrack = trackFilter === "all" || measurement.trackId === trackFilter;
    
    return matchesSearch && matchesTrack;
  });
  
  const totalMeasurements = measurements.length;
  const totalEmissions = measurements.reduce((sum, m) => sum + m.calculatedValue, 0);
  const latestDate = measurements.length > 0 
    ? new Date(Math.max(...measurements.map(m => new Date(m.date).getTime()))).toLocaleDateString() 
    : 'N/A';
  const uniqueSuppliers = new Set(measurements.map(m => m.supplierId).filter(Boolean)).size;
  
  const columns = [
    {
      header: "Date",
      accessorKey: "date",
      cell: (item) => new Date(item.date).toLocaleDateString(),
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
      header: "Factor",
      accessorKey: "factorId",
      cell: (item) => {
        const factor = factors.find(f => f.id === item.factorId);
        return factor ? factor.name : item.factorId;
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
      header: "Quantity",
      accessorKey: "quantity",
      cell: (item) => `${item.quantity} ${item.unit}`,
    },
    {
      header: "Calculated Value",
      accessorKey: "calculatedValue",
      cell: (item) => `${item.calculatedValue.toLocaleString()} tCO₂e`,
    }
  ];

  const handleRowClick = (measurement) => {
    openSidePanel('view', 'measurement', measurement);
  };
  
  const handleCreateNew = () => {
    openSidePanel('create', 'measurement');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Measurements</h1>
          <p className="text-muted-foreground">
            Record activity data and view calculated emissions
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Measurement
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Measurements" 
          value={totalMeasurements}
        />
        <StatCard 
          title="Total Calculated" 
          value={`${totalEmissions.toLocaleString()} tCO2e`}
        />
        <StatCard 
          title="Latest Entry" 
          value={latestDate}
        />
        <StatCard 
          title="Suppliers" 
          value={uniqueSuppliers}
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search measurements..."
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
      
      <DataTable 
        data={filteredMeasurements} 
        columns={columns} 
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default MeasurementsPage;
