
import { useAppContext } from "@/contexts/useAppContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { TargetActions } from "@/components/targets/TargetActions";
import { TargetsList } from "@/components/targets/TargetsList";
import { TargetsSummary } from "@/components/targets/TargetsSummary";

const TargetsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { targets, tracks, scenarios, openSidePanel } = useAppContext();

  const handleCreateTarget = () => {
    openSidePanel('create', 'target');
  };

  const handleAttachExisting = () => {
    // This is just a placeholder - you might want to implement proper target attachment logic
    toast.error("Feature not implemented yet");
  };

  const handleRowClick = (target) => {
    if (target.scenarioId) {
      navigate(`/scenarios/${target.scenarioId}/targets/${target.id}`);
    } else {
      openSidePanel('view', 'target', target);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Reduction Targets</h1>
          <p className="text-muted-foreground">
            Set and track emission reduction goals
          </p>
        </div>
        <TargetActions
          onCreateTarget={handleCreateTarget}
          onAttachExisting={handleAttachExisting}
        />
      </div>

      <TargetsSummary targets={targets} />
      
      <TargetsList
        targets={targets}
        tracks={tracks}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default TargetsPage;
