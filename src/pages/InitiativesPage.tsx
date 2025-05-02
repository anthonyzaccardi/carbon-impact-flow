import { useState } from 'react';
import { useAppContext } from '@/contexts/useAppContext';
import { Initiative } from '@/types';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import StatCard from '@/components/ui/stat-card';
import PageLayout from '@/components/layout/PageLayout';
import MiniBarChart from '@/components/charts/MiniBarChart';
import MiniDonutChart from '@/components/charts/MiniDonutChart';

const InitiativesPage = () => {
  const { initiatives, targets, openSidePanel, extractPercentage } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInitiatives = initiatives.filter(
    (initiative) =>
      initiative.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalInitiatives = initiatives.length;
  const activeInitiatives = initiatives.filter(i => i.status === 'in_progress').length;
  const totalSpend = initiatives.reduce((sum, i) => sum + i.spend, 0);
  const totalImpact = initiatives.reduce((sum, i) => sum + i.absolute, 0);

  // Chart data for initiatives
  const initiativeStatusData = [
    { name: "Not Started", value: initiatives.filter(i => i.status === 'not_started').length },
    { name: "In Progress", value: initiatives.filter(i => i.status === 'in_progress').length },
    { name: "Committed", value: initiatives.filter(i => i.status === 'committed').length },
    { name: "Completed", value: initiatives.filter(i => i.status === 'completed').length }
  ];
  
  const initiativeImpactData = Array.from({ length: 5 }, (_, i) => ({
    name: `Q${i+1}`,
    value: initiatives.slice(i*2, (i+1)*2).reduce((sum, init) => sum + init.absolute, 0)
  }));

  const calculateInitiativeAbsoluteValue = (initiative: Initiative): number => {
    const initiativeTargets = targets.filter(t => initiative.targetIds.includes(t.id));
    
    if (initiativeTargets.length === 0) return 0;
    
    return initiativeTargets.reduce((sum, target) => {
      // Handle potentially undefined plan value
      return sum + (target.targetValue * Math.abs(extractPercentage(initiative.plan)));
    }, 0);
  };

  const handleCreateInitiative = () => {
    openSidePanel('create', 'initiative');
  };

  const handleViewInitiative = (initiative: Initiative) => {
    openSidePanel('view', 'initiative', initiative);
  };

  const getTargetNames = (targetIds: string[]) => {
    return targetIds.map(id => {
      const target = targets.find(t => t.id === id);
      return target ? target.name : 'Unknown Target';
    }).join(', ');
  };

  const statusColorMap: Record<string, string> = {
    'not_started': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    'in_progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  };

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (initiative: Initiative) => (
        <Badge 
          className={statusColorMap[initiative.status] || 'bg-gray-100 text-gray-800'}
          variant="outline"
        >
          {initiative.status.replace('_', ' ')}
        </Badge>
      )
    },
    {
      header: 'Plan',
      accessorKey: 'plan',
    },
    {
      header: 'Trajectory',
      accessorKey: 'trajectory',
      cell: (initiative: Initiative) => (
        <span className="capitalize">{initiative.trajectory.replace('_', ' ')}</span>
      )
    },
    {
      header: 'Timeframe',
      accessorKey: 'startDate',
      cell: (initiative: Initiative) => (
        <span>
          {format(new Date(initiative.startDate), 'MMM d, yyyy')} - {format(new Date(initiative.endDate), 'MMM d, yyyy')}
        </span>
      )
    },
    {
      header: 'Absolute',
      accessorKey: 'absolute',
      cell: (initiative: Initiative) => {
        return <span>{calculateInitiativeAbsoluteValue(initiative).toFixed(2)} tCO₂e</span>;
      }
    },
    {
      header: 'Targets',
      accessorKey: 'targetIds',
      cell: (initiative: Initiative) => {
        const attachedTargets = targets.filter(t => initiative.targetIds.includes(t.id));
        return (
          <div className="flex flex-wrap gap-2">
            {attachedTargets.map(target => (
              <Badge key={target.id} variant="secondary">
                {target.name}
              </Badge>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openSidePanel('view', 'initiative-targets', initiative);
              }}
            >
              Manage
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <PageLayout
      title="Initiatives"
      description="Manage climate action initiatives and interventions"
      breadcrumbItems={[
        { label: "Dashboard", href: "/" },
        { label: "Initiatives" }
      ]}
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-medium">Overview</h2>
        </div>
        <Button onClick={handleCreateInitiative}>
          <Plus className="mr-2 h-4 w-4" />
          Add initiative
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Initiatives" 
          value={totalInitiatives}
          chart={<MiniDonutChart 
            data={initiativeStatusData} 
            height={70} 
          />}
        />
        <StatCard 
          title="Active Initiatives" 
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
          title="Total Spend" 
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
          title="Total Impact" 
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
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search initiatives..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <DataTable
        data={filteredInitiatives}
        columns={columns}
        onRowClick={handleViewInitiative}
      />
    </PageLayout>
  );
};

export default InitiativesPage;
