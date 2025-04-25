import { useAppContext } from "@/contexts/useAppContext";
import StatCard from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  TrendingDown,
  Target,
  Users,
} from "lucide-react";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';

const Overview = () => {
  const { 
    tracks,
    factors,
    measurements,
    targets,
    initiatives,
    scenarios,
    suppliers,
  } = useAppContext();

  // Calculate total emissions across all tracks
  const totalEmissions = tracks.reduce((sum, track) => sum + track.totalEmissions, 0);
  
  // Calculate total reduction goals
  const totalReductionGoal = targets.reduce(
    (sum, target) => sum + (target.baselineValue - target.targetValue), 
    0
  );
  
  // Calculate percentage of reduction against total emissions
  const reductionPercentage = totalEmissions > 0 
    ? Math.round((totalReductionGoal / totalEmissions) * 100) 
    : 0;
  
  // Prepare data for emissions by track chart
  const emissionsByTrack = tracks.map(track => ({
    name: track.name,
    value: track.totalEmissions,
    emoji: track.emoji,
    unit: track.unit,
  }));

  // Calculate initiatives metrics
  const totalSpend = initiatives.reduce((sum, initiative) => sum + initiative.spend, 0);
  const budgetUtilization = totalSpend > 0 
    ? Math.round((totalSpend / (totalSpend * 1.2)) * 100) // Using a rough estimate for budget
    : 0;
  
  // Custom colors for the chart
  const customColors = ['#9b87f5', '#D6BCFA', '#8E9196', '#F1F0FB', '#c084fc', '#a3a3a3'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Dashboard Overview</h1>
        <p className="text-muted-foreground mb-6">
          Welcome to the Carbon Impact Flow dashboard. Monitor your environmental metrics and reduction targets in real-time.
        </p>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Emissions Tracked" 
          value={`${totalEmissions.toLocaleString()} tCO2e`}
          description="Across all categories"
          icon={<BarChart className="h-4 w-4 text-primary" />}
        />
        <StatCard 
          title="Reduction Goals" 
          value={`${reductionPercentage}%`}
          description={`${totalReductionGoal.toLocaleString()} tCO2e planned reduction`}
          icon={<TrendingDown className="h-4 w-4 text-primary" />}
        />
        <StatCard 
          title="Active Initiatives" 
          value={initiatives.filter(i => i.status === "in_progress").length}
          description={`${budgetUtilization}% of budget utilized`}
          icon={<Target className="h-4 w-4 text-primary" />}
        />
        <StatCard 
          title="Suppliers" 
          value={suppliers.length}
          description="Connected organizations"
          icon={<Users className="h-4 w-4 text-primary" />}
        />
      </div>
      
      {/* Emissions by Tracks Chart */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Emissions by Tracks</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={emissionsByTrack}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    // Short name if too long
                    return value.length > 10 ? value.substring(0, 10) + '...' : value;
                  }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => {
                    return [`${value} ${props.payload.unit}`, name];
                  }}
                  labelFormatter={(label) => `${label}`}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border border-border p-2 rounded-md shadow">
                          <p className="font-medium">{data.emoji} {data.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {data.value} {data.unit}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="#9b87f5">
                  {emissionsByTrack.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={customColors[index % customColors.length]} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
