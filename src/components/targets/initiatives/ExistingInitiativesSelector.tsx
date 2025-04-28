
import { useAppContext } from '@/contexts/useAppContext';
import { useState } from 'react';
import { Initiative } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

  // Filter initiatives that are not already attached to this target
  const availableInitiatives = initiatives.filter(i => !i.targetIds.includes(targetId));

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
      <div className="space-y-4">
        {availableInitiatives.length === 0 ? (
          <p className="text-muted-foreground text-center p-4">
            No unattached initiatives available
          </p>
        ) : (
          availableInitiatives.map((initiative) => (
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
                  <p className="text-sm text-muted-foreground">{initiative.description}</p>
                </div>
                <Badge variant="outline">
                  {initiative.status.replace('_', ' ')}
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
      
      <div className="flex justify-end gap-2">
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
