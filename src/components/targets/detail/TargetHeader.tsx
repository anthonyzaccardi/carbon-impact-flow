import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import { Target, Scenario } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TargetHeaderProps {
  target: Target;
  scenario?: Scenario | null;
  onBack: () => void;
  onEditTarget: () => void;
  onCreateInitiative: () => void;
  onAttachExistingInitiative: () => void;
}

export const TargetHeader = ({
  target,
  scenario,
  onBack,
  onEditTarget,
  onCreateInitiative,
  onAttachExistingInitiative,
}: TargetHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={onBack}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {scenario ? `Back to ${scenario.name}` : 'Back to Targets'}
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">
            Target: {target.name}
          </h1>
          {scenario && (
            <p className="text-muted-foreground">
              Scenario: {scenario.name}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onEditTarget}>
          Edit Target
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Initiative
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onCreateInitiative}>
              Create new initiative
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAttachExistingInitiative}>
              Attach existing initiative
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
