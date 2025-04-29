
import { Target, Track } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface TargetSelectionTableProps {
  availableTargets: Target[];
  selectedTargetIds: string[];
  isLinkedOrPending: (id: string) => boolean;
  onSelect: (id: string) => void;
  onSaveSelection: () => void;
  getTrackName: (id: string) => string;
  formatDate: (date: string) => string;
}

export const TargetSelectionTable = ({
  availableTargets,
  selectedTargetIds,
  isLinkedOrPending,
  onSelect,
  onSaveSelection,
  getTrackName,
  formatDate
}: TargetSelectionTableProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-base font-medium">Select targets to attach</h4>
      <ScrollArea className="h-64 border rounded-md">
        <Table>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead className="w-[50px]">Select</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Track</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Target Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availableTargets.map(target => {
              // Check if target is already linked or pending
              const isAlreadyLinked = isLinkedOrPending(target.id);
              
              return (
                <TableRow key={target.id} className={isAlreadyLinked ? "opacity-50" : ""}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedTargetIds.includes(target.id) || isAlreadyLinked} 
                      disabled={isAlreadyLinked}
                      onCheckedChange={() => onSelect(target.id)}
                    />
                  </TableCell>
                  <TableCell>{target.name}</TableCell>
                  <TableCell>{getTrackName(target.trackId)}</TableCell>
                  <TableCell>{target.targetPercentage}% reduction</TableCell>
                  <TableCell>{formatDate(target.targetDate)}</TableCell>
                </TableRow>
              );
            })}
            {availableTargets.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center p-4 text-muted-foreground">
                  No available targets
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      
      <Button 
        onClick={onSaveSelection}
        disabled={selectedTargetIds.length === 0}
        className="w-full"
      >
        {selectedTargetIds.length === 0 
          ? 'Select targets to attach'
          : `Attach ${selectedTargetIds.length} selected target(s)`}
      </Button>
    </div>
  );
};
