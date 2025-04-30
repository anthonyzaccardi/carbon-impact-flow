
import { useAppContext } from "@/contexts/useAppContext";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import StatCard from "@/components/ui/stat-card";
import { Plus, Search, Info } from "lucide-react";
import { Input } from "@/components/ui/input";

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[22px] font-semibold text-[#333336]">Emission Tracks</h1>
        <Button 
          onClick={handleCreateNew} 
          className="bg-[#286EF1] text-white hover:bg-[#286EF1]/90 rounded-lg h-9"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Track
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total Tracks" 
          value={totalTracks}
        />
        <StatCard 
          title="Total Emissions" 
          value={`${totalEmissions.toLocaleString()} tCO₂e`}
        />
        <StatCard 
          title="Avg. per Track" 
          value={`${averageEmissions.toLocaleString()} tCO₂e`}
        />
      </div>
      
      {/* Search and filter bar */}
      <div className="flex mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#71717A]" />
          <Input
            placeholder="Search tracks..."
            className="pl-10 h-9 border-[#DDDDDD] rounded-lg"
          />
        </div>
      </div>
      
      {/* Tracks Table */}
      <div className="border border-[#EEEEEE] rounded-lg bg-white overflow-hidden">
        <DataTable 
          data={tracks} 
          columns={columns} 
          onRowClick={handleRowClick}
          className="intercom-table"
        />
      </div>
    </div>
  );
};

export default TracksPage;
