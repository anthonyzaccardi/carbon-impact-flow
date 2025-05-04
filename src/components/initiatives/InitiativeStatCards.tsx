
import { Initiative } from "@/types";
import StatCard from "@/components/ui/stat-card";
import MiniDonutChart from "@/components/charts/MiniDonutChart";
import MiniBarChart from "@/components/charts/MiniBarChart";

interface InitiativeStatCardsProps {
  initiatives: Initiative[];
}

export const InitiativeStatCards = ({ initiatives }: InitiativeStatCardsProps) => {
  const totalInitiatives = initiatives.length;
  const activeInitiatives = initiatives.filter(i => i.status === 'in_progress').length;
  const totalSpend = initiatives.reduce((sum, i) => sum + i.spend, 0);
  const totalImpact = initiatives.reduce((sum, i) => sum + i.absolute, 0);

  // Chart data for initiatives
  const initiativeStatusData = [
    { name: "Not Started", value: initiatives.filter(i => i.status === 'not_started').length },
    { name: "In Progress", value: initiatives.filter(i => i.status === 'in_progress').length },
    { name: "Completed", value: initiatives.filter(i => i.status === 'completed').length }
  ];
  
  const initiativeImpactData = Array.from({ length: 5 }, (_, i) => ({
    name: `Q${i+1}`,
    value: initiatives.slice(i*2, (i+1)*2).reduce((sum, init) => sum + init.absolute, 0)
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard 
        title="Total initiatives" 
        value={totalInitiatives}
        chart={<MiniDonutChart 
          data={initiativeStatusData} 
          height={70} 
        />}
      />
      <StatCard 
        title="Active initiatives" 
        value={activeInitiatives}
        chart={<MiniBarChart 
          data={initiatives.filter(i => i.status === 'in_progress').slice(0, 5).map((i, idx) => ({
            name: `Init ${idx+1}`,
            value: i.absolute
          }))} 
          height={70}
          color="#10B981"
          variant="gradient"  
        />}
      />
      <StatCard 
        title="Total spend" 
        value={`${totalSpend.toLocaleString()} USD`}
        chart={<MiniBarChart 
          data={initiatives.slice(0, 6).map((i, idx) => ({
            name: `${idx+1}`,
            value: i.spend
          }))}
          height={70}
          color="#1EAEDB"
          showAxis
          variant="gradient"
        />}
      />
      <StatCard 
        title="Total impact" 
        value={`${totalImpact.toFixed(2)} tCO₂e`}
        description="Calculated reduction"
        chart={<MiniBarChart 
          data={initiativeImpactData}
          height={70}
          showAxis
          color="#8B5CF6"
          variant="gradient"
        />}
      />
    </div>
  );
};
