
import { useAppContext } from "@/contexts/useAppContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { TargetActions } from "@/components/targets/TargetActions";
import { TargetsList } from "@/components/targets/TargetsList";
import { TargetsSummary } from "@/components/targets/TargetsSummary";
import { Input } from "@/components/ui/input";

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[22px] font-semibold text-[#333336]">Reduction Targets</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleAttachExisting}
            className="border-[#DDDDDD] text-[#333336] hover:bg-[#F9F9FA] hover:text-[#333336] rounded-lg h-9"
          >
            Attach Existing
          </Button>
          <Button 
            onClick={handleCreateTarget}
            className="bg-[#286EF1] text-white hover:bg-[#286EF1]/90 rounded-lg h-9"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Target
          </Button>
        </div>
      </div>

      <TargetsSummary targets={targets} />
      
      {/* Search and filter bar */}
      <div className="flex my-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#71717A]" />
          <Input
            placeholder="Search targets..."
            className="pl-10 h-9 border-[#DDDDDD] rounded-lg"
          />
        </div>
      </div>
      
      <div className="border border-[#EEEEEE] rounded-lg bg-white overflow-hidden">
        <TargetsList
          targets={targets}
          tracks={tracks}
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
};

export default TargetsPage;
