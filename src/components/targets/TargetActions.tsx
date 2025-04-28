
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExistingTargetsSelector } from "@/components/scenarios/targets/ExistingTargetsSelector";
import { useAppContext } from "@/contexts/useAppContext";

interface TargetActionsProps {
  onCreateTarget: () => void;
  onAttachExisting: () => void;
  scenarioId?: string;
}

export const TargetActions = ({
  onCreateTarget,
  onAttachExisting,
  scenarioId,
}: TargetActionsProps) => {
  const { openSidePanel } = useAppContext();

  const handleAttachExisting = () => {
    if (scenarioId) {
      openSidePanel("view", "custom", {
        title: "Attach Existing Targets",
        content: (
          <ExistingTargetsSelector
            scenarioId={scenarioId}
            onClose={() => openSidePanel("view", "custom", { isOpen: false })}
          />
        ),
      });
    } else {
      onAttachExisting();
    }
  };

  return (
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
        {scenarioId && (
          <DropdownMenuItem onClick={handleAttachExisting}>
            Attach existing target
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
