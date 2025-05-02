
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
import MiniSparkline from "@/components/charts/MiniSparkline";
import MiniBarChart from "@/components/charts/MiniBarChart";
import MiniDonutChart from "@/components/charts/MiniDonutChart";
import PageLayout from "@/components/layout/PageLayout";

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
  
  // Sample data for charts
  const measurementTrendsData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return {
      name: date.toLocaleDateString('en-US', { month: 'short' }),
      value: measurements.filter(m => {
        const mDate = new Date(m.date);
        return mDate.getMonth() === date.getMonth() && mDate.getFullYear() === date.getFullYear();
      }).length
    };
  });
  
  const emissionsByTrackData = tracks.slice(0, 4).map(track => ({
    name: track.name,
    value: measurements
      .filter(m => m.trackId === track.id)
      .reduce((sum, m) => sum + m.calculatedValue, 0)
  }));
  
  const measurementsBySupplierData = suppliers.slice(0, 6).map(supplier => ({
    name: supplier.name,
    value: measurements.filter(m => m.supplierId === supplier.id).length
  }));
  
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
      header: "Calculated value",
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
    <PageLayout 
      title="Measurements" 
      description="Record activity data and view calculated emissions"
      breadcrumbItems={[
        { label: "Dashboard", href: "/" },
        { label: "Measurements" }
      ]}
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-medium">Overview</h2>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add measurement
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total measurements" 
          value={totalMeasurements}
          chart={<MiniSparkline 
            data={measurementTrendsData} 
            color="#1EAEDB" 
            height={60} 
          />}
        />
        <StatCard 
          title="Total calculated" 
          value={`${totalEmissions.toLocaleString()} tCO2e`}
          chart={<MiniBarChart 
            data={emissionsByTrackData} 
            color="#8B5CF6" 
            height={60} 
          />}
        />
        <StatCard 
          title="Latest entry" 
          value={latestDate}
          chart={<MiniSparkline 
            data={Array.from({ length: 7 }, (_, i) => ({
              name: `Day ${i + 1}`,
              value: Math.random() * 10 + 5
            }))}
            color="#10B981" 
            height={60} 
          />}
        />
        <StatCard 
          title="Suppliers" 
          value={uniqueSuppliers}
          chart={<MiniDonutChart 
            data={measurementsBySupplierData.slice(0, 4)} 
            height={80} 
          />}
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
    </PageLayout>
  );
};

export default MeasurementsPage;
