
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/useAppContext";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import StatCard from "@/components/ui/stat-card";
import { Plus } from "lucide-react";
import MiniBarChart from "@/components/charts/MiniBarChart";
import MiniDonutChart from "@/components/charts/MiniDonutChart";
import ProgressIndicator from "@/components/charts/ProgressIndicator";
import PageLayout from "@/components/layout/PageLayout";
import { Track } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const TracksPage = () => {
  const { tracks, openSidePanel, getTrackStats, setTracks } = useAppContext();
  const [loading, setLoading] = useState(true);
  
  // Fetch tracks from Supabase
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const { data, error } = await supabase
          .from('tracks')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setTracks(data);
        }
      } catch (error) {
        console.error('Error fetching tracks:', error);
        toast.error('Failed to load tracks');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTracks();
  }, [setTracks]);
  
  // Metrics
  const totalTracks = tracks.length;
  const totalEmissions = tracks.reduce((sum, track) => sum + track.totalEmissions, 0);
  const averageEmissions = totalTracks > 0 ? totalEmissions / totalTracks : 0;
  
  // Sample data for charts
  const trackEmissionsData = tracks.slice(0, 5).map(track => ({
    name: track.name,
    value: track.totalEmissions
  }));
  
  const trackDistributionData = tracks.map(track => ({
    name: track.name,
    value: track.totalEmissions
  }));
  
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
      header: "Total emissions",
      accessorKey: "totalEmissions",
      cell: (item) => `${item.totalEmissions.toLocaleString()} tCO₂e`,
    }
  ];

  // Handle row click
  const handleRowClick = (track: Track) => {
    openSidePanel('view', 'track', track);
  };
  
  // Handle create new
  const handleCreateNew = () => {
    openSidePanel('create', 'track');
  };

  return (
    <PageLayout
      title="Tracks"
      description="Manage emission categories and their statistics"
      breadcrumbItems={[
        { label: "Dashboard", href: "/" },
        { label: "Tracks" }
      ]}
    >
      <div className="flex justify-end mb-6">
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add track
        </Button>
      </div>
  
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total tracks" 
          value={loading ? "Loading..." : totalTracks}
          chart={<MiniBarChart 
            data={trackEmissionsData} 
            height={60} 
            color="#9b87f5" 
          />}
        />
        <StatCard 
          title="Total emissions" 
          value={loading ? "Loading..." : `${totalEmissions.toLocaleString()} tCO2e`}
          chart={<MiniDonutChart 
            data={trackDistributionData.slice(0, 4)} 
            height={80} 
          />}
        />
        <StatCard 
          title="Avg. per track" 
          value={loading ? "Loading..." : `${averageEmissions.toLocaleString()} tCO2e`}
          chart={<ProgressIndicator 
            current={averageEmissions} 
            target={totalEmissions} 
            color="#8B5CF6" 
          />}
        />
      </div>
  
      {/* Tracks Table */}
      <DataTable 
        data={tracks} 
        columns={columns} 
        onRowClick={handleRowClick}
        isLoading={loading}
      />
    </PageLayout>
  );
};

export default TracksPage;
