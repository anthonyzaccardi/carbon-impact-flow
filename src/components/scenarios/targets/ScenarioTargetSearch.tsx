
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ScenarioTargetSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const ScenarioTargetSearch = ({ searchTerm, onSearchChange }: ScenarioTargetSearchProps) => {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search targets..."
        className="pl-10"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};
