
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Target, Track } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "@/components/ui/data-table";
import { useState } from "react";

interface ScenarioTargetsSectionProps {
  targets: Target[];
  tracks: Track[];
  onCreateTarget: () => void;
  onAttachExisting: () => void;
  onRemoveTarget: (targetId: string) => void;
  onRowClick: (target: Target) => void;
}

export const ScenarioTargetsSection = ({
  targets,
  tracks,
  onCreateTarget,
  onAttachExisting,
  onRemoveTarget,
  onRowClick
}: ScenarioTargetsSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredTargets = targets.filter(target => 
    target.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search targets..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Target
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onCreateTarget}>
              Create new target
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAttachExisting}>
              Attach existing target
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <DataTable
        data={filteredTargets}
        columns={columns}
        onRowClick={onRowClick}
      />
    </>
  );
};
