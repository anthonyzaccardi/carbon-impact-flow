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

const InitiativesPage = () => {
  const { initiatives, targets, openSidePanel, extractPercentage } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter initiatives based on search query
  const filteredInitiatives = initiatives.filter(
    (initiative) =>
      initiative.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate metrics for stat cards
  const totalInitiatives = initiatives.length;
  const activeInitiatives = initiatives.filter(i => i.status === 'in_progress').length;
  const totalSpend = initiatives.reduce((sum, i) => sum + i.spend, 0);
  const totalImpact = initiatives.reduce((sum, i) => sum + i.absolute, 0);

  // Calculate the absolute value for an initiative: sum of target values * plan percentage
  const calculateInitiativeAbsoluteValue = (initiative: Initiative): number => {
    const initiativeTargets = targets.filter(t => initiative.targetIds.includes(t.id));
    
    if (initiativeTargets.length === 0) return 0;
    
    return initiativeTargets.reduce((sum, target) => {
      return sum + (target.targetValue * Math.abs(extractPercentage(initiative.plan)));
    }, 0);
  };

  const handleCreateInitiative = () => {
    openSidePanel('create', 'initiative');
  };

  const handleViewInitiative = (initiative: Initiative) => {
    openSidePanel('view', 'initiative', initiative);
  };

  // Helper function to get target names for an initiative
  const getTargetNames = (targetIds: string[]) => {
    return targetIds.map(id => {
      const target = targets.find(t => t.id === id);
      return target ? target.name : 'Unknown Target';
    }).join(', ');
  };

  // Status color mapping
  const statusColorMap: Record<string, string> = {
    'not_started': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'committed': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
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
        // Use the calculated value from the current initiative
        return <span>{calculateInitiativeAbsoluteValue(initiative).toFixed(2)} tCO₂e</span>;
      }
    },
    {
      header: 'Targets',
      accessorKey: 'targetIds',
      cell: (initiative: Initiative) => (
        <span className="line-clamp-1">{getTargetNames(initiative.targetIds)}</span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Initiatives</h1>
          <p className="text-muted-foreground">
            Manage climate action initiatives and interventions
          </p>
        </div>
        <Button onClick={handleCreateInitiative}>
          <Plus className="mr-2 h-4 w-4" />
          Add Initiative
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Initiatives" 
          value={totalInitiatives}
        />
        <StatCard 
          title="Active Initiatives" 
          value={activeInitiatives}
        />
        <StatCard 
          title="Total Spend" 
          value={`${totalSpend.toLocaleString()} USD`}
        />
        <StatCard 
          title="Total Impact" 
          value={`${totalImpact.toFixed(2)} tCO₂e`}
          description="Calculated reduction"
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
    </div>
  );
};

export default InitiativesPage;
