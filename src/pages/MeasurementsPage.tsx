
import { useState } from "react";
import { useAppContext } from "@/contexts/useAppContext";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import { Plus } from "lucide-react";
import { Measurement } from "@/types";
import FilterPanel from "@/components/measurements/FilterPanel";
import MeasurementsStats from "@/components/measurements/MeasurementsStats";
import MeasurementsTable from "@/components/measurements/MeasurementsTable";

const MeasurementsPage = () => {
  const { measurements, tracks, factors, suppliers, openSidePanel } = useAppContext();
  const [filteredMeasurements, setFilteredMeasurements] = useState<Measurement[]>(measurements);
  
  const handleRowClick = (measurement: Measurement) => {
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
      
      <MeasurementsStats 
        measurements={measurements} 
        tracks={tracks}
        suppliers={suppliers}
      />
      
      <FilterPanel 
        measurements={measurements}
        tracks={tracks}
        factors={factors}
        suppliers={suppliers}
        onFilterChange={setFilteredMeasurements}
      />
      
      <MeasurementsTable 
        measurements={filteredMeasurements}
        tracks={tracks}
        factors={factors}
        suppliers={suppliers}
        onRowClick={handleRowClick}
      />
    </PageLayout>
  );
};

export default MeasurementsPage;
