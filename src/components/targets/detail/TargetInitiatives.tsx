
import { Initiative } from "@/types";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TargetInitiativesProps {
  initiatives: Initiative[];
  onCreateInitiative: () => void;
  onAttachExistingInitiative: () => void;
  onRemoveInitiative: (initiativeId: string) => void;
  onInitiativeClick: (initiative: Initiative) => void;
}

export const TargetInitiatives = ({
  initiatives,
  onCreateInitiative,
  onAttachExistingInitiative,
  onRemoveInitiative,
  onInitiativeClick,
}: TargetInitiativesProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInitiatives = initiatives.filter(initiative => 
    initiative.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColorMap = {
    not_started: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (initiative: Initiative) => (
        <Badge 
          className={statusColorMap[initiative.status as keyof typeof statusColorMap] || ''}
          variant="outline"
        >
          {initiative.status.replace('_', ' ')}
        </Badge>
      )
    },
    {
      header: "Plan",
      accessorKey: "plan",
    },
    {
      header: "Impact",
      accessorKey: "absolute",
      cell: (initiative: Initiative) => `${initiative.absolute.toLocaleString()} tCO2e`,
    },
    {
      header: "Spend",
      accessorKey: "spend",
      cell: (initiative: Initiative) => `${initiative.spend.toLocaleString()} ${initiative.currency}`,
    },
    {
      header: "Timeframe",
      accessorKey: "period",
      cell: (initiative: Initiative) => (
        <span>
          {new Date(initiative.startDate).toLocaleDateString()} - {new Date(initiative.endDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (initiative: Initiative) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onRemoveInitiative(initiative.id);
          }}
        >
          Remove
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Initiatives ({initiatives.length})</h2>
        
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
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search initiatives..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <DataTable
        data={filteredInitiatives}
        columns={columns}
        onRowClick={onInitiativeClick}
      />
    </div>
  );
};
