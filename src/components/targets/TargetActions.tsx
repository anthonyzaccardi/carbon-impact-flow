
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Target } from "@/types";

interface TargetActionsProps {
  onCreateTarget: () => void;
  onAttachExisting: () => void;
}

export const TargetActions = ({ onCreateTarget, onAttachExisting }: TargetActionsProps) => {
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
        <DropdownMenuItem onClick={onAttachExisting}>
          Attach existing target
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
