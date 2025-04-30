
import { Target, Track } from "@/types";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TargetsListProps {
  targets: Target[];
  tracks: Track[];
  onRowClick: (target: Target) => void;
  onRemoveTarget?: (targetId: string) => void;
}

export const TargetsList = ({ targets, tracks, onRowClick, onRemoveTarget }: TargetsListProps) => {
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
      header: "Target Date",
      accessorKey: "targetDate",
      cell: (target: Target) => new Date(target.targetDate).toLocaleDateString(),
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    ...(onRemoveTarget ? [{
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
    }] : [])
  ];

  return (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search targets..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <DataTable
        data={filteredTargets}
        columns={columns}
        onRowClick={onRowClick}
      />
    </>
  );
};
