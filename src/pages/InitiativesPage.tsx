
import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Initiative } from '@/types';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const InitiativesPage = () => {
  const { initiatives, targets, openSidePanel } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter initiatives based on search query
  const filteredInitiatives = initiatives.filter(
    (initiative) =>
      initiative.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      initiative.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      cell: (initiative: Initiative) => (
        <span>{initiative.absolute.toFixed(2)} tCO₂e</span>
      )
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
        <h1 className="text-2xl font-bold">Initiatives</h1>
        <Button onClick={handleCreateInitiative}>
          <Plus className="mr-2 h-4 w-4" />
          Add Initiative
        </Button>
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
