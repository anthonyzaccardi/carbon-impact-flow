
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Scenario } from "@/types";

interface ScenarioHeaderProps {
  scenario: Scenario;
  onBack: () => void;
  onEdit: () => void;
}

export const ScenarioHeader = ({ scenario, onBack, onEdit }: ScenarioHeaderProps) => {
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
          Back to Scenarios
        </Button>
        <h1 className="text-2xl font-semibold">
          Scenario: {scenario.name}
        </h1>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onEdit}>
          Edit Scenario
        </Button>
      </div>
    </div>
  );
};
