
import { Target, Track } from "@/types";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface TargetsListProps {
  targets: Target[];
  tracks: Track[];
  onRowClick: (target: Target) => void;
  onRemoveTarget?: (targetId: string) => void;
}

export const TargetsList = ({ targets, tracks, onRowClick, onRemoveTarget }: TargetsListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-[#444448] font-medium">Name</TableHead>
          <TableHead className="text-[#444448] font-medium">Track</TableHead>
          <TableHead className="text-[#444448] font-medium">Target</TableHead>
          <TableHead className="text-[#444448] font-medium">Target Date</TableHead>
          <TableHead className="text-[#444448] font-medium">Status</TableHead>
          {onRemoveTarget && <TableHead className="text-[#444448] font-medium">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {targets.map((target) => (
          <TableRow 
            key={target.id} 
            className="hover:bg-[#F9F9FA] cursor-pointer"
            onClick={() => onRowClick(target)}
          >
            <TableCell>{target.name}</TableCell>
            <TableCell>
              {(() => {
                const track = tracks.find(t => t.id === target.trackId);
                return track ? (
                  <div className="flex items-center">
                    <span className="mr-1">{track.emoji}</span>
                    <span>{track.name}</span>
                  </div>
                ) : target.trackId;
              })()}
            </TableCell>
            <TableCell>{`${target.targetPercentage}% reduction`}</TableCell>
            <TableCell>{new Date(target.targetDate).toLocaleDateString()}</TableCell>
            <TableCell>{target.status}</TableCell>
            {onRemoveTarget && (
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTarget(target.id);
                  }}
                  className="text-[#286EF1] hover:bg-[#F9F9FA]"
                >
                  Remove
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
