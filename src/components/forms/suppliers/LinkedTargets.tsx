
import { useAppContext } from "@/contexts/useAppContext";
import { Target } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

interface LinkedTargetsProps {
  targets: Target[];
  supplierId: string;
}

export const LinkedTargets = ({ targets, supplierId }: LinkedTargetsProps) => {
  const { targets: allTargets, updateTarget } = useAppContext();
  const [selectedTargetId, setSelectedTargetId] = useState<string>("");

  // Filter out targets that already have a supplier
  const availableTargets = allTargets.filter(t => !t.supplierId);

  const handleAttachTarget = () => {
    if (!selectedTargetId) return;

    const target = allTargets.find(t => t.id === selectedTargetId);
    if (target) {
      updateTarget(target.id, { ...target, supplierId });
      setSelectedTargetId("");
      toast.success("Target attached to supplier");
    }
  };

  const handleDetachTarget = (targetId: string) => {
    const target = allTargets.find(t => t.id === targetId);
    if (target) {
      updateTarget(targetId, { ...target, supplierId: undefined });
      toast.success("Target detached from supplier");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Linked Targets</h3>
        <div className="space-y-2">
          {targets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No targets linked to this supplier</p>
          ) : (
            targets.map((target) => (
              <div key={target.id} className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <p className="font-medium">{target.name}</p>
                  <p className="text-sm text-muted-foreground">{target.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{target.status.replace('_', ' ')}</Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDetachTarget(target.id)}
                  >
                    Detach
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {availableTargets.length > 0 && (
        <div className="flex gap-2">
          <Select
            value={selectedTargetId}
            onValueChange={setSelectedTargetId}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a target to attach" />
            </SelectTrigger>
            <SelectContent>
              {availableTargets.map((target) => (
                <SelectItem key={target.id} value={target.id}>
                  {target.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAttachTarget}
            disabled={!selectedTargetId}
          >
            Attach
          </Button>
        </div>
      )}
    </div>
  );
};
