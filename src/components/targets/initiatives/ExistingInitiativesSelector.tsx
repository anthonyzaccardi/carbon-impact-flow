
import { useAppContext } from '@/contexts/useAppContext';
import { useState } from 'react';
import { Initiative } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ExistingInitiativesSelectorProps {
  targetId: string;
  onClose: () => void;
}

export const ExistingInitiativesSelector = ({
  targetId,
  onClose
}: ExistingInitiativesSelectorProps) => {
  const { initiatives, addTargetsToInitiative } = useAppContext();
  const [selectedInitiatives, setSelectedInitiatives] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter initiatives that are not already attached to this target
  const availableInitiatives = initiatives.filter(i => !i.targetIds.includes(targetId));
  
  // Apply search filter
  const filteredInitiatives = availableInitiatives.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInitiativeClick = (initiativeId: string) => {
    setSelectedInitiatives(prev => 
      prev.includes(initiativeId) 
        ? prev.filter(id => id !== initiativeId)
        : [...prev, initiativeId]
    );
  };

  const handleAttach = () => {
    selectedInitiatives.forEach(initiativeId => {
      addTargetsToInitiative(initiativeId, [targetId]);
    });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search initiatives..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        {filteredInitiatives.length === 0 ? (
          <p className="text-muted-foreground text-center p-4">
            {searchTerm ? "No initiatives match your search" : "No unattached initiatives available"}
          </p>
        ) : (
          filteredInitiatives.map((initiative) => (
            <div
              key={initiative.id}
              onClick={() => handleInitiativeClick(initiative.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedInitiatives.includes(initiative.id)
                  ? 'border-primary bg-primary/5'
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{initiative.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{initiative.description}</p>
                </div>
                <Badge variant="outline">
                  {initiative.status === "not_started" ? "Not Started" :
                   initiative.status === "in_progress" ? "In Progress" :
                   initiative.status === "committed" ? "Committed" : "Completed"}
                </Badge>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                <span>Plan: {initiative.plan}</span>
                <span className="mx-2">•</span>
                <span>Impact: {initiative.absolute.toLocaleString()} tCO₂e</span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleAttach}
          disabled={selectedInitiatives.length === 0}
        >
          Add Selected ({selectedInitiatives.length})
        </Button>
      </div>
    </div>
  );
};
