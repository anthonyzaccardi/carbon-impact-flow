
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/ui/stat-card";
import { Target } from "@/types";
import MiniDonutChart from "@/components/charts/MiniDonutChart";
import ProgressIndicator from "@/components/charts/ProgressIndicator";
import MiniBarChart from "@/components/charts/MiniBarChart";

interface ScenarioSummaryProps {
  targets: Target[];
}

export const ScenarioSummary = ({ targets }: ScenarioSummaryProps) => {
  const totalTargets = targets.length;
  const totalBaseline = targets.reduce((sum, t) => sum + t.baselineValue, 0);
  const totalReduction = targets.reduce((sum, t) => sum + (t.baselineValue - t.targetValue), 0);
  const reductionPercentage = totalBaseline > 0 ? ((totalReduction / totalBaseline) * 100).toFixed(1) : '0';

  // Sample data for charts
  const targetDistributionData = targets.slice(0, 4).map((target, idx) => ({
    name: `Target ${idx + 1}`,
    value: target.targetValue
  }));
  
  const reductionByTargetData = targets.slice(0, 6).map((target, idx) => ({
    name: `T${idx + 1}`,
    value: target.baselineValue - target.targetValue
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            title="Total Targets" 
            value={totalTargets}
            chart={<MiniDonutChart 
              data={targetDistributionData}
              colors={["#8B5CF6", "#1EAEDB", "#10B981", "#F97316"]} 
              height={80} 
            />}
          />
          <StatCard 
            title="Total Baseline" 
            value={`${totalBaseline.toLocaleString()} tCO2e`}
            chart={<MiniBarChart 
              data={targets.slice(0, 5).map((t, idx) => ({
                name: `T${idx + 1}`,
                value: t.baselineValue
              }))}
              color="#1EAEDB" 
              height={60} 
            />}
          />
          <StatCard 
            title="Total Reduction" 
            value={`${totalReduction.toLocaleString()} tCO2e`}
            chart={<MiniBarChart 
              data={reductionByTargetData}
              color="#10B981" 
              height={60} 
            />}
          />
          <StatCard 
            title="Reduction Percentage" 
            value={`${reductionPercentage}%`}
            chart={<ProgressIndicator 
              current={parseFloat(reductionPercentage)} 
              target={100}
              color="#F97316" 
            />}
          />
        </div>
      </CardContent>
    </Card>
  );
};
