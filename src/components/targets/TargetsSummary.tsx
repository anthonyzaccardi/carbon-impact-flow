
import { Target } from "@/types";
import StatCard from "@/components/ui/stat-card";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <StatCard 
        title="Total Targets" 
        value={totalTargets}
      />
      <StatCard 
        title="Total Baseline" 
        value={`${totalBaseline.toLocaleString()} tCO₂e`}
      />
      <StatCard 
        title="Total Reduction" 
        value={`${totalReduction.toLocaleString()} tCO₂e`}
      />
      <StatCard 
        title="Average Reduction" 
        value={`${averageReduction.toFixed(1)}%`}
      />
    </div>
  );
};
