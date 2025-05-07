
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { FilterX, Search } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Measurement, Track, Factor, Supplier } from "@/types";

interface FilterPanelProps {
  measurements: Measurement[];
  tracks: Track[];
  factors: Factor[];
  suppliers: Supplier[];
  onFilterChange: (filtered: Measurement[]) => void;
}

const FilterPanel = ({
  measurements,
  tracks,
  factors,
  suppliers,
  onFilterChange,
}: FilterPanelProps) => {
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

  // Apply filters to measurements
  useEffect(() => {
    const filteredData = measurements.filter(measurement => {
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
    
    onFilterChange(filteredData);
  }, [
    measurements, 
    searchTerm, 
    trackFilter, 
    factorFilter, 
    supplierFilter, 
    activeQuantityRange, 
    activeCalculatedValueRange,
    onFilterChange
  ]);

  return (
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
  );
};

export default FilterPanel;
