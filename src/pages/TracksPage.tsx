import { useAppContext } from "@/contexts/useAppContext";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import StatCard from "@/components/ui/stat-card";
import { Plus } from "lucide-react";

const TracksPage = () => {
  const { tracks, openSidePanel, getTrackStats } = useAppContext();
  
  // Metrics
  const totalTracks = tracks.length;
  const totalEmissions = tracks.reduce((sum, track) => sum + track.totalEmissions, 0);
  const averageEmissions = totalTracks > 0 ? totalEmissions / totalTracks : 0;
  
  // Table columns
  const columns = [
    {
      header: "Track",
      accessorKey: "name",
      cell: (item) => (
        <div className="flex items-center">
          <span className="mr-2 text-lg">{item.emoji}</span>
          <span>{item.name}</span>
        </div>
      ),
    },
    {
      header: "Factors",
      accessorKey: "factorsCount",
      cell: (item) => {
        const stats = getTrackStats(item.id);
        return stats.factorsCount;
      },
    },
    {
      header: "Measurements",
      accessorKey: "measurementsCount",
      cell: (item) => {
        const stats = getTrackStats(item.id);
        return stats.measurementsCount;
      },
    },
    {
      header: "Targets",
      accessorKey: "targetsCount",
      cell: (item) => {
        const stats = getTrackStats(item.id);
        return stats.targetsCount;
      },
    },
    {
      header: "Total Emissions",
      accessorKey: "totalEmissions",
      cell: (item) => `${item.totalEmissions.toLocaleString()} tCO₂e`,
    }
  ];

  // Handle row click
  const handleRowClick = (track) => {
    openSidePanel('view', 'track', track);
  };
  
  // Handle create new
  const handleCreateNew = () => {
    openSidePanel('create', 'track');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Emission Tracks</h1>
          <p className="text-muted-foreground">
            Manage emission categories and their statistics
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Track
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Tracks" 
          value={totalTracks}
        />
        <StatCard 
          title="Total Emissions" 
          value={`${totalEmissions.toLocaleString()} tCO2e`}
        />
        <StatCard 
          title="Avg. per Track" 
          value={`${averageEmissions.toLocaleString()} tCO2e`}
        />
      </div>
      
      {/* Tracks Table */}
      <DataTable 
        data={tracks} 
        columns={columns} 
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default TracksPage;
