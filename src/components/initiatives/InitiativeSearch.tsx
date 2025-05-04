
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface InitiativeSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const InitiativeSearch = ({ 
  searchQuery, 
  setSearchQuery 
}: InitiativeSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search initiatives..."
        className="pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};
