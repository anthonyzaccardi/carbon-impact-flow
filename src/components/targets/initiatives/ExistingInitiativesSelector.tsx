
import { useState } from "react";
import { Initiative } from "@/types";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/contexts/useAppContext";
import { cn } from "@/lib/utils";

interface ExistingInitiativesSelectorProps {
  targetId: string;
  onClose: () => void;
}

export const ExistingInitiativesSelector = ({
  targetId,
  onClose,
}: ExistingInitiativesSelectorProps) => {
  const { initiatives, addTargetsToInitiative } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInitiatives, setSelectedInitiatives] = useState<string[]>([]);

  // Filter out initiatives that already have this target
  const availableInitiatives = initiatives.filter(
    (initiative) =>
      !initiative.targetIds.includes(targetId) &&
      initiative.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const attachedInitiatives = initiatives.filter((initiative) =>
    initiative.targetIds.includes(targetId)
  );

  const handleInitiativeClick = (initiativeId: string) => {
    setSelectedInitiatives((prev) =>
      prev.includes(initiativeId)
        ? prev.filter((id) => id !== initiativeId)
        : [...prev, initiativeId]
    );
  };

  const handleAttachInitiatives = () => {
    selectedInitiatives.forEach((initiativeId) => {
      addTargetsToInitiative(initiativeId, [targetId]);
    });
    onClose();
  };

  const renderInitiative = (initiative: Initiative, isAttached = false) => (
    <div
      key={initiative.id}
      className={cn(
        "p-4 border rounded-md mb-2 cursor-pointer transition-colors",
        isAttached
          ? "bg-muted cursor-not-allowed opacity-50"
          : selectedInitiatives.includes(initiative.id)
          ? "bg-primary/10 border-primary"
          : "hover:bg-accent"
      )}
      onClick={() => !isAttached && handleInitiativeClick(initiative.id)}
    >
      <h3 className="font-medium">{initiative.name}</h3>
      <p className="text-sm text-muted-foreground">
        {initiative.status} - {initiative.absolute.toLocaleString()} tCO2e impact
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-background p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search initiatives..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {attachedInitiatives.length > 0 && (
          <div>
            <h2 className="font-medium mb-2">Already Attached</h2>
            {attachedInitiatives.map((initiative) =>
              renderInitiative(initiative, true)
            )}
          </div>
        )}

        <div>
          <h2 className="font-medium mb-2">Available Initiatives</h2>
          {availableInitiatives.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No available initiatives found
            </p>
          ) : (
            availableInitiatives.map((initiative) => renderInitiative(initiative))
          )}
        </div>
      </div>

      <div className="sticky bottom-0 bg-background p-4 border-t">
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAttachInitiatives}
            disabled={selectedInitiatives.length === 0}
          >
            Add Selected ({selectedInitiatives.length})
          </Button>
        </div>
      </div>
    </div>
  );
};
