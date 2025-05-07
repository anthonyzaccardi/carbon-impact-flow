
import { useAppContext } from "@/contexts/useAppContext";
import { Button } from "@/components/ui/button";
import SortableTable from "@/components/ui/sortable-table"; // Changed from DataTable
import StatCard from "@/components/ui/stat-card";
import { Plus, Search, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useMemo } from "react";
import MiniSparkline from "@/components/charts/MiniSparkline";
import MiniBarChart from "@/components/charts/MiniBarChart";
import MiniDonutChart from "@/components/charts/MiniDonutChart";
import PageLayout from "@/components/layout/PageLayout";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const MeasurementsPage = () => {
  const { measurements, tracks, factors, suppliers, openSidePanel } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [trackFilter, setTrackFilter] = useState("all");
  const [factorFilter, setFactorFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  
  // Quantity range filter
  const [quantityRange, setQuantityRange] = useState<[number, number]>([0, 0]);
  const [activeQuantityRange, setActiveQuantityRange] = useState<[number, number]>([0, 0]);
  
  // Calculated value range filter
  const [calculatedValueRange, setCalculatedValueRange] = useState<[number, number]>([0, 0]);
  const [activeCalculatedValueRange, setActiveCalculatedValueRange] = useState<[number, number]>([0, 0]);
  
  // Determine min/max values for sliders
  useEffect(() => {
    if (measurements.length > 0) {
      // Find min/max for quantity
      const quantities = measurements.map(m => m.quantity);
      const minQuantity = Math.floor(Math.min(...quantities));
      const maxQuantity = Math.ceil(Math.max(...quantities));
      setQuantityRange([minQuantity, maxQuantity]);
      setActiveQuantityRange([minQuantity, maxQuantity]);
      
      // Find min/max for calculated values
      const calcValues = measurements.map(m => m.calculatedValue);
      const minCalcValue = Math.floor(Math.min(...calcValues));
      const maxCalcValue = Math.ceil(Math.max(...calcValues));
      setCalculatedValueRange([minCalcValue, maxCalcValue]);
      setActiveCalculatedValueRange([minCalcValue, maxCalcValue]);
    }
  }, [measurements]);
  
  // Reset filters
  const resetFilters = () => {
    setTrackFilter("all");
    setFactorFilter("all");
    setSupplierFilter("all");
    setActiveQuantityRange([quantityRange[0], quantityRange[1]]);
    setActiveCalculatedValueRange([calculatedValueRange[0], calculatedValueRange[1]]);
  };
  
  // Check if any filter is active
  const isFilterActive = trackFilter !== "all" || 
                        factorFilter !== "all" || 
                        supplierFilter !== "all" || 
                        activeQuantityRange[0] > quantityRange[0] || 
                        activeQuantityRange[1] < quantityRange[1] || 
                        activeCalculatedValueRange[0] > calculatedValueRange[0] || 
                        activeCalculatedValueRange[1] < calculatedValueRange[1];
  
  // Apply all filters to measurements
  const filteredMeasurements = useMemo(() => {
    return measurements.filter(measurement => {
      const matchesSearch = searchTerm === "" || 
        measurement.unit.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTrack = trackFilter === "all" || measurement.trackId === trackFilter;
      const matchesFactor = factorFilter === "all" || measurement.factorId === factorFilter;
      const matchesSupplier = supplierFilter === "all" || 
        (measurement.supplierId ? measurement.supplierId === supplierFilter : supplierFilter === "none");
      
      // Range filters
      const matchesQuantityRange = 
        measurement.quantity >= activeQuantityRange[0] && 
        measurement.quantity <= activeQuantityRange[1];
        
      const matchesCalculatedValueRange = 
        measurement.calculatedValue >= activeCalculatedValueRange[0] && 
        measurement.calculatedValue <= activeCalculatedValueRange[1];
      
      return matchesSearch && 
             matchesTrack && 
             matchesFactor && 
             matchesSupplier && 
             matchesQuantityRange && 
             matchesCalculatedValueRange;
    });
  }, [
    measurements, 
    searchTerm, 
    trackFilter, 
    factorFilter, 
    supplierFilter, 
    activeQuantityRange, 
    activeCalculatedValueRange
  ]);
  
  // Stats calculations
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
      sortable: true,
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
      },
      sortable: true,
    },
    {
      header: "Factor",
      accessorKey: "factorId",
      cell: (item) => {
        const factor = factors.find(f => f.id === item.factorId);
        return factor ? factor.name : item.factorId;
      },
      sortable: true,
    },
    {
      header: "Supplier",
      accessorKey: "supplierId",
      cell: (item) => {
        if (!item.supplierId) return "—";
        const supplier = suppliers.find(s => s.id === item.supplierId);
        return supplier ? supplier.name : item.supplierId;
      },
      sortable: true,
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      cell: (item) => `${item.quantity} ${item.unit}`,
      sortable: true,
    },
    {
      header: "Calculated value",
      accessorKey: "calculatedValue",
      cell: (item) => `${item.calculatedValue.toLocaleString()} tCO₂e`,
      sortable: true,
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
      
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Filters</h3>
          {isFilterActive && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetFilters}
              className="flex items-center"
            >
              <FilterX className="mr-1 h-4 w-4" />
              Reset filters
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search measurements..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Track</label>
              <Select
                value={trackFilter}
                onValueChange={setTrackFilter}
              >
                <SelectTrigger>
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
            
            <div>
              <label className="text-sm font-medium mb-1 block">Factor</label>
              <Select
                value={factorFilter}
                onValueChange={setFactorFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by factor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Factors</SelectItem>
                  {factors.map((factor) => (
                    <SelectItem key={factor.id} value={factor.id}>
                      {factor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Supplier</label>
              <Select
                value={supplierFilter}
                onValueChange={setSupplierFilter}
              >
                <SelectTrigger>
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Quantity</label>
                <div className="text-xs text-muted-foreground">
                  {activeQuantityRange[0]} - {activeQuantityRange[1]}
                </div>
              </div>
              <Slider 
                min={quantityRange[0]} 
                max={quantityRange[1]} 
                step={1}
                value={[activeQuantityRange[0], activeQuantityRange[1]]}
                onValueChange={(value) => setActiveQuantityRange([value[0], value[1]])}
                className="py-4"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Calculated value (tCO₂e)</label>
                <div className="text-xs text-muted-foreground">
                  {activeCalculatedValueRange[0]} - {activeCalculatedValueRange[1]}
                </div>
              </div>
              <Slider 
                min={calculatedValueRange[0]} 
                max={calculatedValueRange[1]} 
                step={1}
                value={[activeCalculatedValueRange[0], activeCalculatedValueRange[1]]}
                onValueChange={(value) => setActiveCalculatedValueRange([value[0], value[1]])}
                className="py-4"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {trackFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Track: {tracks.find(t => t.id === trackFilter)?.name || trackFilter}
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => setTrackFilter("all")}
                >
                  ✕
                </button>
              </Badge>
            )}
            {factorFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Factor: {factors.find(f => f.id === factorFilter)?.name || factorFilter}
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => setFactorFilter("all")}
                >
                  ✕
                </button>
              </Badge>
            )}
            {supplierFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Supplier: {supplierFilter === "none" ? "None" : (suppliers.find(s => s.id === supplierFilter)?.name || supplierFilter)}
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => setSupplierFilter("all")}
                >
                  ✕
                </button>
              </Badge>
            )}
            {(activeQuantityRange[0] > quantityRange[0] || activeQuantityRange[1] < quantityRange[1]) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Quantity: {activeQuantityRange[0]}-{activeQuantityRange[1]}
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => setActiveQuantityRange([quantityRange[0], quantityRange[1]])}
                >
                  ✕
                </button>
              </Badge>
            )}
            {(activeCalculatedValueRange[0] > calculatedValueRange[0] || activeCalculatedValueRange[1] < calculatedValueRange[1]) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Value: {activeCalculatedValueRange[0]}-{activeCalculatedValueRange[1]} tCO₂e
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => setActiveCalculatedValueRange([calculatedValueRange[0], calculatedValueRange[1]])}
                >
                  ✕
                </button>
              </Badge>
            )}
          </div>
        </div>
      </Card>
      
      <SortableTable 
        data={filteredMeasurements} 
        columns={columns} 
        onRowClick={handleRowClick}
        className="measurements-table" // Added for customization
      />
    </PageLayout>
  );
};

export default MeasurementsPage;
