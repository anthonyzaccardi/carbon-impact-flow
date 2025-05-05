
import { useState } from "react";
import { Target, Track } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/useAppContext";
import { ScenarioTargetAttachmentManager } from "@/components/targets/scenario/ScenarioTargetAttachmentManager";
import { SortableTable, SortableColumn } from "@/components/ui/sortable-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TargetsListProps {
  targets: Target[];
  tracks: Track[];
  onRowClick: (target: Target) => void;
}

// Define ExtendedTarget interface that extends Target with the additional property
interface ExtendedTarget extends Target {
  correctedTargetValue: number;
}

export const TargetsList: React.FC<TargetsListProps> = ({
  targets,
  tracks,
  onRowClick,
}) => {
  const { scenarios, openSidePanel } = useAppContext();
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  // Calculate the correct target values
  const targetsWithCorrectValues = targets.map(target => {
    // Calculate the correct target value: baseline * (1 - percentage/100)
    const correctedTargetValue = target.baselineValue * (1 - (target.targetPercentage / 100));
    return {
      ...target,
      correctedTargetValue
    } as ExtendedTarget;
  });

  const handleManageScenario = (targetId: string) => {
    setSelectedTargetId(targetId);
    openSidePanel('view', 'custom', {
      title: "Manage Scenario Association",
      content: (
        <ScenarioTargetAttachmentManager
          targetId={targetId}
          onClose={() => openSidePanel('view', 'custom', { isOpen: false })}
        />
      ),
    });
  };

  // Update the type for columns to be compatible with ExtendedTarget
  const columns: SortableColumn<ExtendedTarget>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Track",
      cell: (target: ExtendedTarget) => {
        const track = tracks.find((t) => t.id === target.trackId);
        return track ? (
          <div className="flex items-center gap-2">
            <span>{track.emoji}</span>
            <span>{track.name}</span>
          </div>
        ) : (
          "Unknown Track"
        );
      },
      accessorKey: "trackId",
    },
    {
      header: "Baseline",
      cell: (target: ExtendedTarget) => (
        <span>{target.baselineValue.toLocaleString()} tCO₂e</span>
      ),
      accessorKey: "baselineValue",
    },
    {
      header: "Target",
      cell: (target: ExtendedTarget) => (
        <span>{target.correctedTargetValue.toLocaleString()} tCO₂e</span>
      ),
      accessorKey: "correctedTargetValue",
    },
    {
      header: "Reduction",
      cell: (target: ExtendedTarget) => (
        <Badge variant="outline">
          {target.targetPercentage}%
        </Badge>
      ),
      accessorKey: "targetPercentage",
    },
    {
      header: "Target Date",
      cell: (target: ExtendedTarget) => (
        <span>{new Date(target.targetDate).toLocaleDateString()}</span>
      ),
      accessorKey: "targetDate",
    },
    {
      header: "Scenario",
      cell: (target: ExtendedTarget) => {
        if (target.scenarioId) {
          const scenario = scenarios.find(s => s.id === target.scenarioId);
          return (
            <div className="flex items-center gap-2">
              <span>{scenario ? scenario.name : "Unknown Scenario"}</span>
              <Button 
                variant="ghost" 
                size="sm"
                className="ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleManageScenario(target.id);
                }}
              >
                Manage
              </Button>
            </div>
          );
        }
        return (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleManageScenario(target.id);
            }}
          >
            Manage
          </Button>
        );
      },
      accessorKey: "scenarioId",
    },
    {
      header: "Status",
      cell: (target: ExtendedTarget) => (
        <Badge
          className={
            target.status === "completed"
              ? "bg-green-100 text-green-800"
              : target.status === "in_progress"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }
        >
          {target.status.replace("_", " ")}
        </Badge>
      ),
      accessorKey: "status",
    }
  ];

  return (
    <div className="space-y-4">
      <SortableTable
        data={targetsWithCorrectValues}
        columns={columns}
        onRowClick={onRowClick}
      />
    </div>
  );
};
