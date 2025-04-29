
import { useAppContext } from "@/contexts/useAppContext";
import { Target } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LinkedTargetsProps {
  targets: Target[];
  supplierId?: string;
  isViewMode: boolean;
  pendingTargetIds?: string[];
  setPendingTargetIds?: (ids: string[]) => void;
}

export const LinkedTargets = ({ 
  targets, 
  supplierId, 
  isViewMode,
  pendingTargetIds = [],
  setPendingTargetIds = () => {}
}: LinkedTargetsProps) => {
  const { targets: allTargets, updateTarget, tracks } = useAppContext();
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);

  // Include both currently linked targets and pending targets for display
  const displayTargets = [
    ...targets,
    ...allTargets.filter(t => pendingTargetIds.includes(t.id) && !targets.some(lt => lt.id === t.id))
  ];

  // Get targets that are available (not linked to any supplier except current one)
  const availableTargets = allTargets.filter(t => 
    !t.supplierId || (supplierId && t.supplierId === supplierId)
  );

  // Handle checkbox selection
  const handleSelect = (targetId: string) => {
    setSelectedTargetIds(prev => {
      if (prev.includes(targetId)) {
        return prev.filter(id => id !== targetId);
      } else {
        return [...prev, targetId];
      }
    });
  };

  // Handle saving multiple selected targets
  const handleSaveSelection = () => {
    if (selectedTargetIds.length === 0) return;

    if (supplierId) {
      // If we have a supplierId (edit mode), update targets immediately
      selectedTargetIds.forEach(targetId => {
        const target = allTargets.find(t => t.id === targetId);
        if (target) {
          updateTarget(targetId, { ...target, supplierId });
        }
      });
      toast.success(`${selectedTargetIds.length} target(s) attached to supplier`);
    } else {
      // Otherwise, add to pending targets (create mode)
      const newPendingIds = [...pendingTargetIds];
      
      selectedTargetIds.forEach(id => {
        if (!newPendingIds.includes(id)) {
          newPendingIds.push(id);
        }
      });
      
      setPendingTargetIds(newPendingIds);
      toast.success(`${selectedTargetIds.length} target(s) will be attached after supplier creation`);
    }
    
    setSelectedTargetIds([]);
  };

  // Handle detaching a target
  const handleDetachTarget = (targetId: string) => {
    if (supplierId) {
      // If we have a supplierId (edit mode), update target immediately
      const target = allTargets.find(t => t.id === targetId);
      if (target) {
        updateTarget(targetId, { ...target, supplierId: undefined });
        toast.success("Target detached from supplier");
      }
    } else {
      // Otherwise, remove from pending targets (create mode)
      setPendingTargetIds(pendingTargetIds.filter(id => id !== targetId));
      toast.success("Target removed from selection");
    }
  };

  const isPending = (targetId: string) => !supplierId && pendingTargetIds.includes(targetId);
  
  // Check if a target is already linked to this supplier or pending
  const isLinkedOrPending = (targetId: string) => {
    return displayTargets.some(t => t.id === targetId) || pendingTargetIds.includes(targetId);
  };
  
  // Get track name for a target
  const getTrackName = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    return track ? track.name : 'Unknown';
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Linked Targets</h3>
        <div className="space-y-2">
          {displayTargets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No targets linked to this supplier</p>
          ) : (
            displayTargets.map((target) => (
              <div key={target.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/10">
                <div>
                  <p className="font-medium">
                    {target.name}
                    {isPending(target.id) && (
                      <span className="ml-2 text-xs text-muted-foreground">(pending)</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{target.targetPercentage}% reduction</Badge>
                    <Badge variant="outline">{target.status.replace('_', ' ')}</Badge>
                  </div>
                </div>
                {!isViewMode && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDetachTarget(target.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Detach</span>
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {!isViewMode && availableTargets.length > 0 && (
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
                          onCheckedChange={() => handleSelect(target.id)}
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
            onClick={handleSaveSelection}
            disabled={selectedTargetIds.length === 0}
            className="w-full"
          >
            {supplierId 
              ? `Attach ${selectedTargetIds.length} selected target(s)` 
              : `Add ${selectedTargetIds.length} target(s) to be attached`}
          </Button>
        </div>
      )}
    </div>
  );
};
