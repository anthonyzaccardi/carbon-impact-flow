
import { useState } from "react";
import { Target, Track } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/useAppContext";
import { ScenarioTargetAttachmentManager } from "@/components/targets/scenario/ScenarioTargetAttachmentManager";
import { SortableTable } from "@/components/ui/sortable-table";
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

export const TargetsList: React.FC<TargetsListProps> = ({
  targets,
  tracks,
  onRowClick,
}) => {
  const { scenarios, openSidePanel } = useAppContext();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);

  // Calculate the correct target values
  const targetsWithCorrectValues = targets.map(target => {
    // Calculate the correct target value: baseline * (1 - percentage/100)
    const correctedTargetValue = target.baselineValue * (1 - (target.targetPercentage / 100));
    return {
      ...target,
      correctedTargetValue
    };
  });

  const handleAttachToScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    openSidePanel('view', 'custom', {
      title: "Attach Targets to Scenario",
      content: (
        <ScenarioTargetAttachmentManager
          scenarioId={scenarioId}
          onClose={() => openSidePanel('view', 'custom', { isOpen: false })}
        />
      ),
    });
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof Target,
    },
    {
      header: "Track",
      cell: (target: Target & { correctedTargetValue: number }) => {
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
      accessorKey: "trackId" as keyof Target,
    },
    {
      header: "Baseline",
      cell: (target: Target & { correctedTargetValue: number }) => (
        <span>{target.baselineValue.toLocaleString()} tCO₂e</span>
      ),
      accessorKey: "baselineValue" as keyof Target,
    },
    {
      header: "Target",
      cell: (target: Target & { correctedTargetValue: number }) => (
        <span>{target.correctedTargetValue.toLocaleString()} tCO₂e</span>
      ),
      accessorKey: "correctedTargetValue",
    },
    {
      header: "Reduction",
      cell: (target: Target & { correctedTargetValue: number }) => (
        <Badge variant="outline">
          {target.targetPercentage}%
        </Badge>
      ),
      accessorKey: "targetPercentage" as keyof Target,
    },
    {
      header: "Target Date",
      cell: (target: Target & { correctedTargetValue: number }) => (
        <span>{new Date(target.targetDate).toLocaleDateString()}</span>
      ),
      accessorKey: "targetDate" as keyof Target,
    },
    {
      header: "Scenario",
      cell: (target: Target & { correctedTargetValue: number }) => {
        if (target.scenarioId) {
          const scenario = scenarios.find(s => s.id === target.scenarioId);
          return scenario ? scenario.name : "Unknown Scenario";
        }
        return "None";
      },
      accessorKey: "scenarioId" as keyof Target,
    },
    {
      header: "Status",
      cell: (target: Target & { correctedTargetValue: number }) => (
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
      accessorKey: "status" as keyof Target,
    },
    {
      header: "",
      sortable: false,
      cell: (target: Target & { correctedTargetValue: number }) => {
        if (target.scenarioId) return null;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="ml-auto"
                onClick={(e) => e.stopPropagation()}
              >
                Attach to Scenario
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {scenarios.length > 0 ? (
                scenarios.map(scenario => (
                  <DropdownMenuItem 
                    key={scenario.id} 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAttachToScenario(scenario.id);
                    }}
                  >
                    {scenario.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No scenarios available</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
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
