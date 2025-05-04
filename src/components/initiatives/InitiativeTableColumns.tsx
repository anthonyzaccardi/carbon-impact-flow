
import { Initiative, Target } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface GetInitiativeColumnsOptions {
  targets: Target[];
  extractPercentage: (plan: string) => number;
  onManageTargets: (initiative: Initiative) => void;
  calculateInitiativeAbsoluteValue: (initiative: Initiative) => number;
}

export const getInitiativeColumns = ({ 
  targets, 
  extractPercentage, 
  onManageTargets,
  calculateInitiativeAbsoluteValue
}: GetInitiativeColumnsOptions) => {
  const statusColorMap: Record<string, string> = {
    'not_started': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    'in_progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  };

  return [
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
                onManageTargets(initiative);
              }}
            >
              Manage
            </Button>
          </div>
        );
      }
    }
  ];
};
