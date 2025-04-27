
import { Target, Track } from "@/types";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";

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
  onRemoveTarget 
}: ScenarioTargetTableProps) => {
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Track",
      accessorKey: "trackId",
      cell: (target: Target) => {
        const track = tracks.find(t => t.id === target.trackId);
        return track ? (
          <div className="flex items-center">
            <span className="mr-1">{track.emoji}</span>
            <span>{track.name}</span>
          </div>
        ) : target.trackId;
      }
    },
    {
      header: "Target",
      accessorKey: "targetPercentage",
      cell: (target: Target) => `${target.targetPercentage}% reduction`,
    },
    {
      header: "Baseline",
      accessorKey: "baselineValue",
      cell: (target: Target) => `${target.baselineValue.toLocaleString()} tCO2e`,
    },
    {
      header: "Target Value",
      accessorKey: "targetValue",
      cell: (target: Target) => `${target.targetValue.toLocaleString()} tCO2e`,
    },
    {
      header: "Target Date",
      accessorKey: "targetDate",
      cell: (target: Target) => new Date(target.targetDate).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (target: Target) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onRemoveTarget(target.id);
          }}
        >
          Remove
        </Button>
      )
    }
  ];

  return (
    <DataTable
      data={targets}
      columns={columns}
      onRowClick={onRowClick}
    />
  );
};
