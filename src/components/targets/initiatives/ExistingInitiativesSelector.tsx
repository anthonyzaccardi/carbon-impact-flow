
import { useState, useMemo } from 'react';
import { useAppContext } from '@/contexts/useAppContext';
import { Initiative } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { SortableTable } from '@/components/ui/sortable-table';

interface ExistingInitiativesSelectorProps {
  targetId: string;
  onClose: () => void;
}

export const ExistingInitiativesSelector: React.FC<ExistingInitiativesSelectorProps> = ({
  targetId,
  onClose,
}) => {
  const { initiatives, addTargetsToInitiative } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInitiatives, setSelectedInitiatives] = useState<string[]>([]);

  // Filter out initiatives that are already associated with this target
  const availableInitiatives = useMemo(() => {
    return initiatives.filter(initiative => !initiative.targetIds.includes(targetId));
  }, [initiatives, targetId]);

  const filteredInitiatives = useMemo(() => {
    return availableInitiatives.filter(initiative =>
      initiative.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableInitiatives, searchTerm]);

  const toggleInitiative = (initiativeId: string) => {
    setSelectedInitiatives(prev =>
      prev.includes(initiativeId)
        ? prev.filter(id => id !== initiativeId)
        : [...prev, initiativeId]
    );
  };

  const handleAttach = () => {
    if (selectedInitiatives.length) {
      // Attach each selected initiative to the target
      selectedInitiatives.forEach(initiativeId => {
        addTargetsToInitiative(initiativeId, [targetId]);
      });
      onClose();
    }
  };

  const columns = [
    {
      header: '',
      cell: (initiative: Initiative) => (
        <Checkbox
          checked={selectedInitiatives.includes(initiative.id)}
          onCheckedChange={() => toggleInitiative(initiative.id)}
          className="pointer-events-none" // Prevent event conflict with row click
        />
      ),
      sortable: false
    },
    {
      header: 'Name',
      accessorKey: 'name' as keyof Initiative
    },
    {
      header: 'Status',
      cell: (initiative: Initiative) => (
        <Badge 
          variant="outline"
          className={
            initiative.status === 'completed' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
              : initiative.status === 'in_progress'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
          }
        >
          {initiative.status.replace('_', ' ')}
        </Badge>
      ),
      accessorKey: 'status' as keyof Initiative
    },
    {
      header: 'Plan',
      accessorKey: 'plan' as keyof Initiative
    },
    {
      header: 'Spend',
      cell: (initiative: Initiative) => `${initiative.spend.toLocaleString()} ${initiative.currency}`,
      accessorKey: 'spend' as keyof Initiative
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Attach Existing Initiatives</h3>
      <p className="text-sm text-muted-foreground">
        Select initiatives to attach to this target.
      </p>
      
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search initiatives..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredInitiatives.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? "No initiatives match your search" : "No initiatives available to attach"}
        </div>
      ) : (
        <div className="max-h-[60vh] overflow-y-auto">
          <SortableTable
            data={filteredInitiatives}
            columns={columns}
            onRowClick={(initiative) => toggleInitiative(initiative.id)}
          />
        </div>
      )}
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleAttach}
          disabled={selectedInitiatives.length === 0}
        >
          Attach Selected ({selectedInitiatives.length})
        </Button>
      </div>
    </div>
  );
};
