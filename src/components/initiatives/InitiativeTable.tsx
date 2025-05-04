
import { Initiative, Target } from "@/types";
import DataTable from "@/components/ui/data-table";
import { getInitiativeColumns } from "./InitiativeTableColumns";

interface InitiativeTableProps {
  initiatives: Initiative[];
  targets: Target[];
  extractPercentage: (plan: string) => number;
  onInitiativeClick: (initiative: Initiative) => void;
  onManageTargets: (initiative: Initiative) => void;
  calculateInitiativeAbsoluteValue: (initiative: Initiative) => number;
}

export const InitiativeTable = ({
  initiatives,
  targets,
  extractPercentage,
  onInitiativeClick,
  onManageTargets,
  calculateInitiativeAbsoluteValue
}: InitiativeTableProps) => {
  const columns = getInitiativeColumns({ 
    targets, 
    extractPercentage, 
    onManageTargets,
    calculateInitiativeAbsoluteValue
  });

  return (
    <DataTable
      data={initiatives}
      columns={columns}
      onRowClick={onInitiativeClick}
    />
  );
};
