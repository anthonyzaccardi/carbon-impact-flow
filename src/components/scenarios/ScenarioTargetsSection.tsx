
import { useState } from "react";
import { Target, Track } from "@/types";
import { ScenarioTargetSearch } from "./targets/ScenarioTargetSearch";
import { TargetActions } from "@/components/targets/TargetActions";
import { ScenarioTargetTable } from "./targets/ScenarioTargetTable";

interface ScenarioTargetsSectionProps {
  targets: Target[];
  tracks: Track[];
  scenarioId: string;
  onCreateTarget: () => void;
  onAttachExisting: () => void;
  onRemoveTarget: (targetId: string) => void;
  onRowClick: (target: Target) => void;
}

export const ScenarioTargetsSection = ({
  targets,
  tracks,
  scenarioId,
  onCreateTarget,
  onAttachExisting,
  onRemoveTarget,
  onRowClick
}: ScenarioTargetsSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredTargets = targets.filter(target => 
    target.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <ScenarioTargetSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <TargetActions
          scenarioId={scenarioId}
          onCreateTarget={onCreateTarget}
          onAttachExisting={onAttachExisting}
        />
      </div>
      
      <ScenarioTargetTable
        targets={filteredTargets}
        tracks={tracks}
        onRowClick={onRowClick}
        onRemoveTarget={onRemoveTarget}
      />
    </>
  );
};
