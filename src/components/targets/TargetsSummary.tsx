
import { Card, CardContent } from "@/components/ui/card";
import StatCard from "@/components/ui/stat-card";
import { Target } from "@/types";
import MiniBarChart from "@/components/charts/MiniBarChart";
import MiniDonutChart from "@/components/charts/MiniDonutChart";
import ProgressIndicator from "@/components/charts/ProgressIndicator";
import MiniSparkline from "@/components/charts/MiniSparkline";

interface TargetsSummaryProps {
  targets: Target[];
}

export const TargetsSummary = ({ targets }: TargetsSummaryProps) => {
  // Calculate metrics
  const totalTargets = targets.length;
  const totalBaseline = targets.reduce((sum, t) => sum + t.baselineValue, 0);
  const totalReduction = targets.reduce((sum, t) => sum + (t.baselineValue - t.targetValue), 0);
  const averageReduction = targets.length > 0 ? 
    targets.reduce((sum, t) => sum + t.targetPercentage, 0) / targets.length : 0;

  // Sample data for charts
  const reductionByTargetData = targets.slice(0, 5).map((target, idx) => ({
    name: `Target ${idx + 1}`,
    value: target.baselineValue - target.targetValue
  }));
  
  const targetPercentageData = targets.slice(0, 5).map((target, idx) => ({
    name: `Target ${idx + 1}`,
    value: target.targetPercentage
  }));
  
  const targetDistributionData = targets.slice(0, 4).map((target, idx) => ({
    name: `Target ${idx + 1}`,
    value: target.targetValue
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard 
        title="Total Targets" 
        value={totalTargets}
        chart={<MiniBarChart 
          data={reductionByTargetData} 
          color="#8B5CF6" 
          height={60} 
        />}
      />
      <StatCard 
        title="Total Baseline" 
        value={`${totalBaseline.toLocaleString()} tCO2e`}
        chart={<MiniSparkline 
          data={targets.slice(0, 6).map((t, idx) => ({
            name: `${idx}`,
            value: t.baselineValue
          }))}
          color="#1EAEDB" 
          height={60} 
        />}
      />
      <StatCard 
        title="Total Reduction" 
        value={`${totalReduction.toLocaleString()} tCO2e`}
        chart={<ProgressIndicator 
          current={totalReduction} 
          target={totalBaseline * 0.4} // Assuming a 40% reduction goal
          color="#10B981" 
        />}
      />
      <StatCard 
        title="Average Reduction" 
        value={`${averageReduction.toFixed(1)}%`}
        chart={<MiniDonutChart 
          data={targetDistributionData} 
          colors={["#8B5CF6", "#1EAEDB", "#10B981", "#F97316"]}
          height={80} 
        />}
      />
    </div>
  );
};
