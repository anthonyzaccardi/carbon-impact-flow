
import { Button } from "@/components/ui/button";
import { Target, Track } from "@/types";
import { Badge } from "@/components/ui/badge";
import { SortableTable } from "@/components/ui/sortable-table";

interface ScenarioTargetTableProps {
  targets: Target[];
  tracks: Track[];
  onRowClick: (target: Target) => void;
  onRemoveTarget: (targetId: string) => void;
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
    };
  });

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof Target
    },
    {
      header: "Track",
      cell: (target: Target) => {
        const trackId = target.trackId;
        const track = tracks.find(t => t.id === trackId);
        return track ? (
          <div className="flex items-center gap-2">
            <span>{track.emoji}</span>
            <span>{track.name}</span>
          </div>
        ) : "Unknown";
      },
      accessorKey: "trackId" as keyof Target
    },
    {
      header: "Baseline",
      cell: (target: Target) => `${target.baselineValue.toLocaleString()} tCO₂e`,
      accessorKey: "baselineValue" as keyof Target
    },
    {
      header: "Target",
      cell: (target: Target & { correctedTargetValue?: number }) => 
        `${(target.correctedTargetValue || 0).toLocaleString()} tCO₂e`,
      accessorKey: "targetValue" as keyof Target
    },
    {
      header: "Reduction",
      cell: (target: Target) => (
        <Badge variant="outline">{target.targetPercentage}%</Badge>
      ),
      accessorKey: "targetPercentage" as keyof Target
    },
    {
      header: "Status",
      cell: (target: Target) => (
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
      accessorKey: "status" as keyof Target
    },
    {
      header: "",
      cell: (target: Target) => (
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
      accessorKey: "id" as keyof Target,
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
