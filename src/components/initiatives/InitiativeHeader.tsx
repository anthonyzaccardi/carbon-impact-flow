
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface InitiativeHeaderProps {
  onCreateInitiative: () => void;
}

export const InitiativeHeader = ({ onCreateInitiative }: InitiativeHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-medium">Overview</h2>
      </div>
      <Button onClick={onCreateInitiative}>
        <Plus className="mr-2 h-4 w-4" />
        Add initiative
      </Button>
    </div>
  );
};
