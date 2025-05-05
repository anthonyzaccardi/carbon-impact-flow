
import React from "react";
import { Scenario } from "@/types";
import { Slideshow } from "@/components/ui/slideshow";
import { ScenarioCard } from "./ScenarioCard";

interface FeaturedScenariosProps {
  scenarios: Scenario[];
  onScenarioClick: (scenario: Scenario) => void;
}

export const FeaturedScenarios = ({
  scenarios,
  onScenarioClick,
}: FeaturedScenariosProps) => {
  if (!scenarios.length) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/10">
        <h3 className="text-lg font-medium mb-2">No scenarios found</h3>
        <p className="text-muted-foreground">
          Create your first scenario to get started.
        </p>
      </div>
    );
  }

  return (
    <Slideshow
      items={scenarios}
      renderItem={(scenario) => (
        <ScenarioCard 
          key={scenario.id} 
          scenario={scenario}
          onClick={() => onScenarioClick(scenario)}
          trackGroups={[]} // Added missing required props
          stats={{ totalTargets: 0, totalReduction: 0 }} // Added missing required props
        />
      )}
      slidesToShow={3}
    />
  );
};
