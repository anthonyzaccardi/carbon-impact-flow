
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/ui/stat-card";
import { Target } from "@/types";

interface ScenarioSummaryProps {
  targets: Target[];
}

export const ScenarioSummary = ({ targets }: ScenarioSummaryProps) => {
  const totalTargets = targets.length;
  const totalBaseline = targets.reduce((sum, t) => sum + t.baselineValue, 0);
  const totalReduction = targets.reduce((sum, t) => sum + (t.baselineValue - t.targetValue), 0);
  const reductionPercentage = totalBaseline > 0 ? ((totalReduction / totalBaseline) * 100).toFixed(1) : '0';

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
          />
          <StatCard 
            title="Total Baseline" 
            value={`${totalBaseline.toLocaleString()} tCO2e`}
          />
          <StatCard 
            title="Total Reduction" 
            value={`${totalReduction.toLocaleString()} tCO2e`}
          />
          <StatCard 
            title="Reduction Percentage" 
            value={`${reductionPercentage}%`}
          />
        </div>
      </CardContent>
    </Card>
  );
};
