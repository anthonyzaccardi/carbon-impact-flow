
import { Button } from "@/components/ui/button";
import { Target, Track } from "@/types";
import { Badge } from "@/components/ui/badge";
import { SortableTable, SortableColumn } from "@/components/ui/sortable-table";

interface ScenarioTargetTableProps {
  targets: Target[];
  tracks: Track[];
  onRowClick: (target: Target) => void;
  onRemoveTarget: (targetId: string) => void;
}

// Define ExtendedTarget to include the correctedTargetValue property
interface ExtendedTarget extends Target {
  correctedTargetValue: number;
}

export const ScenarioTargetTable = ({
  targets,
  tracks,
  onRowClick,
  onRemoveTarget,
}: ScenarioTargetTableProps) => {
  // Calculate the correct target values
  const targetsWithCorrectValues = targets.map(target => {
    // Calculate the correct target value: baseline * (1 - percentage/100)
    const correctedTargetValue = target.baselineValue * (1 - (target.targetPercentage / 100));
    return {
      ...target,
      correctedTargetValue
    } as ExtendedTarget;
  });

  const columns: SortableColumn<ExtendedTarget>[] = [
    {
      header: "Name",
      accessorKey: "name"
    },
    {
      header: "Track",
      cell: (target: ExtendedTarget) => {
        const trackId = target.trackId;
        const track = tracks.find(t => t.id === trackId);
        return track ? (
          <div className="flex items-center gap-2">
            <span>{track.emoji}</span>
            <span>{track.name}</span>
          </div>
        ) : "Unknown";
      },
      accessorKey: "trackId"
    },
    {
      header: "Baseline",
      cell: (target: ExtendedTarget) => `${target.baselineValue.toLocaleString()} tCO₂e`,
      accessorKey: "baselineValue"
    },
    {
      header: "Target",
      cell: (target: ExtendedTarget) => 
        `${target.correctedTargetValue.toLocaleString()} tCO₂e`,
      accessorKey: "correctedTargetValue"
    },
    {
      header: "Reduction",
      cell: (target: ExtendedTarget) => (
        <Badge variant="outline">{target.targetPercentage}%</Badge>
      ),
      accessorKey: "targetPercentage"
    },
    {
      header: "Status",
      cell: (target: ExtendedTarget) => (
        <Badge 
          className={
            target.status === 'completed' 
              ? 'bg-green-100 text-green-800' 
              : target.status === 'in_progress'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
          }
        >
          {target.status ? target.status.replace('_', ' ') : 'not started'}
        </Badge>
      ),
      accessorKey: "status"
    },
    {
      header: "",
      cell: (target: ExtendedTarget) => (
        <Button 
          variant="ghost" 
          size="sm"
          className="ml-auto" 
          onClick={(e) => {
            e.stopPropagation();
            onRemoveTarget(target.id);
          }}
        >
          Remove
        </Button>
      ),
      accessorKey: "id",
      sortable: false
    }
  ];

  return (
    <SortableTable
      data={targetsWithCorrectValues}
      columns={columns}
      onRowClick={onRowClick}
    />
  );
};
