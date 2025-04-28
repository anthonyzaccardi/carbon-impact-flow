
import { useState } from "react";
import { Target } from "@/types";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/contexts/useAppContext";
import { cn } from "@/lib/utils";

interface ExistingTargetsSelectorProps {
  scenarioId: string;
  onClose: () => void;
}

export const ExistingTargetsSelector = ({
  scenarioId,
  onClose,
}: ExistingTargetsSelectorProps) => {
  const { targets, updateTarget } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);

  // Filter out targets that are already in a scenario or match search
  const availableTargets = targets.filter(
    (target) =>
      !target.scenarioId &&
      target.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const attachedTargets = targets.filter(
    (target) => target.scenarioId === scenarioId
  );

  const handleTargetClick = (targetId: string) => {
    setSelectedTargets((prev) =>
      prev.includes(targetId)
        ? prev.filter((id) => id !== targetId)
        : [...prev, targetId]
    );
  };

  const handleAttachTargets = () => {
    selectedTargets.forEach((targetId) => {
      const target = targets.find((t) => t.id === targetId);
      if (target) {
        updateTarget(targetId, { ...target, scenarioId });
      }
    });
    onClose();
  };

  const renderTarget = (target: Target, isAttached = false) => (
    <div
      key={target.id}
      className={cn(
        "p-4 border rounded-md mb-2 cursor-pointer transition-colors",
        isAttached
          ? "bg-muted cursor-not-allowed opacity-50"
          : selectedTargets.includes(target.id)
          ? "bg-primary/10 border-primary"
          : "hover:bg-accent"
      )}
      onClick={() => !isAttached && handleTargetClick(target.id)}
    >
      <h3 className="font-medium">{target.name}</h3>
      <p className="text-sm text-muted-foreground">
        {target.targetPercentage}% reduction by{" "}
        {new Date(target.targetDate).toLocaleDateString()}
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-background p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search targets..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {attachedTargets.length > 0 && (
          <div>
            <h2 className="font-medium mb-2">Already Attached</h2>
            {attachedTargets.map((target) => renderTarget(target, true))}
          </div>
        )}

        <div>
          <h2 className="font-medium mb-2">Available Targets</h2>
          {availableTargets.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No available targets found
            </p>
          ) : (
            availableTargets.map((target) => renderTarget(target))
          )}
        </div>
      </div>

      <div className="sticky bottom-0 bg-background p-4 border-t">
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAttachTargets}
            disabled={selectedTargets.length === 0}
          >
            Add Selected ({selectedTargets.length})
          </Button>
        </div>
      </div>
    </div>
  );
};
