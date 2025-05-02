
import { useAppContext } from "@/contexts/useAppContext";
import { TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TargetActions } from "@/components/targets/TargetActions";
import { TargetsList } from "@/components/targets/TargetsList";
import { TargetsSummary } from "@/components/targets/TargetsSummary";
import PageLayout from "@/components/layout/PageLayout";

const TargetsPage = () => {
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
    <PageLayout 
      title="Reduction Targets" 
      description="Set and track emission reduction goals"
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Targets", icon: <TrendingDown className="h-4 w-4" /> }
      ]}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          {/* Title and description are now in PageLayout */}
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
    </PageLayout>
  );
};

export default TargetsPage;
