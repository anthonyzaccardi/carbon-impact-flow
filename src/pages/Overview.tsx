
import { useAppContext } from "@/contexts/useAppContext";
import StatCard from "@/components/ui/stat-card";
import { Activity, ArrowUp, Users, Calendar, Cloud, Battery, Leaf, TrendingUp } from "lucide-react";
import MiniSparkline from "@/components/charts/MiniSparkline";
import MiniBarChart from "@/components/charts/MiniBarChart";
import MiniDonutChart from "@/components/charts/MiniDonutChart";
import ProgressIndicator from "@/components/charts/ProgressIndicator";
import BreadcrumbNav from "@/components/ui/breadcrumb-nav";
import { Card, CardContent } from "@/components/ui/card";

const Overview = () => {
  const {
    tracks,
    measurements,
    targets,
    initiatives
  } = useAppContext();
  
  const totalEmissions = tracks.reduce((sum, track) => {
    const trackMeasurements = measurements.filter(m => m.trackId === track.id);
    const trackEmissions = trackMeasurements.reduce((trackSum, measurement) => trackSum + measurement.calculatedValue, 0);
    return sum + trackEmissions;
  }, 0);
  
  const emissionsChange = 5.2; // Example trend
  
  // Sample data for charts
  const emissionsData = [
    { name: 'Jan', value: 5200 },
    { name: 'Feb', value: 4800 },
    { name: 'Mar', value: 6100 },
    { name: 'Apr', value: 5400 },
    { name: 'May', value: 5000 },
    { name: 'Jun', value: 4700 },
  ];
  
  const trackDistributionData = tracks.slice(0, 4).map(track => ({
    name: track.name,
    value: track.totalEmissions
  }));
  
  const measurementTrendsData = [
    { name: 'Week 1', value: 25 },
    { name: 'Week 2', value: 40 },
    { name: 'Week 3', value: 30 },
    { name: 'Week 4', value: 45 },
  ];
  
  const targetProgressData = {
    current: targets.reduce((sum, target) => sum + (target.baselineValue - target.targetValue), 0),
    target: targets.reduce((sum, target) => sum + target.baselineValue, 0) * 0.3 // Assuming 30% reduction goal
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <BreadcrumbNav items={[{ label: "Overview", icon: <TrendingUp className="h-4 w-4" /> }]} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">Overview Dashboard</h1>
        <p className="text-muted-foreground max-w-3xl">
          Track your environmental impact metrics and progress toward reduction goals across all emission sources.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Tracks" 
          value={tracks.length} 
          description="Active emission tracking categories" 
          icon={<Activity className="h-5 w-5" />}
          iconVariant="subtle"
          chart={<MiniBarChart data={trackDistributionData} color="#10B981" height={60} />}
        />

        <StatCard 
          title="Active Measurements" 
          value={measurements.length} 
          description="Total recorded measurements" 
          icon={<Calendar className="h-5 w-5" />}
          iconVariant="subtle"
          chart={<MiniSparkline data={measurementTrendsData} color="#1EAEDB" height={60} />}
        />

        <StatCard 
          title="Set Targets" 
          value={targets.length} 
          description="Emission reduction targets" 
          icon={<ArrowUp className="h-5 w-5" />}
          iconVariant="subtle"
          chart={<ProgressIndicator 
            current={targetProgressData.current} 
            target={targetProgressData.target} 
            color="#10B981" 
          />}
        />

        <StatCard 
          title="Ongoing Initiatives" 
          value={initiatives.length} 
          description="Active reduction programs" 
          icon={<Users className="h-5 w-5" />}
          iconVariant="subtle"
          chart={<MiniBarChart 
            data={initiatives.slice(0, 5).map((i, idx) => ({ 
              name: `Initiative ${idx + 1}`, 
              value: Math.random() * 100 
            }))}
            color="#F97316" 
            height={60} 
          />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <StatCard 
          title="Total Emissions" 
          value={`${totalEmissions.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })} tCO₂e`} 
          description="Carbon dioxide equivalent" 
          icon={<Cloud className="h-5 w-5" />}
          variant="gradient" 
          className="md:col-span-3" 
          size="lg"
          trend={{
            value: emissionsChange,
            isPositive: false
          }}
          chart={<MiniSparkline data={emissionsData} color="rgba(255,255,255,0.8)" height={60} />}
        />

        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Emission Sources</h3>
            <div className="space-y-4">
              {tracks.slice(0, 5).map((track, idx) => (
                <div key={track.id} className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    {track.emoji}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{track.name}</span>
                      <span>{track.totalEmissions.toLocaleString()} tCO₂e</span>
                    </div>
                    <ProgressIndicator 
                      current={track.totalEmissions}
                      target={totalEmissions}
                      color={['#10B981', '#1EAEDB', '#F97316', '#8B5CF6', '#FBBF24'][idx % 5]}
                      size="sm"
                      variant="slim"
                      showLabels={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Reduction Goals</h3>
            <div className="flex items-center justify-center h-[200px]">
              <MiniDonutChart
                data={[
                  { name: 'Achieved', value: targetProgressData.current },
                  { name: 'Remaining', value: targetProgressData.target - targetProgressData.current }
                ]}
                colors={["#10B981", "#D1D5DB"]}
                height={180}
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {((targetProgressData.current / targetProgressData.target) * 100).toFixed(1)}% Complete
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
