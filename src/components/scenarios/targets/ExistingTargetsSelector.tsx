
import { useState } from 'react';
import { useAppContext } from '@/contexts/useAppContext';
import { Target } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExistingTargetsSelectorProps {
  scenarioId: string;
  onClose: () => void;
}

export const ExistingTargetsSelector = ({
  scenarioId,
  onClose
}: ExistingTargetsSelectorProps) => {
  const { targets, updateTarget } = useAppContext();
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);

  // Filter targets that are not already in this scenario
  const availableTargets = targets.filter(t => !t.scenarioId);

  const handleTargetClick = (targetId: string) => {
    setSelectedTargets(prev => 
      prev.includes(targetId) 
        ? prev.filter(id => id !== targetId)
        : [...prev, targetId]
    );
  };

  const handleAttachTargets = () => {
    selectedTargets.forEach(targetId => {
      const target = targets.find(t => t.id === targetId);
      if (target) {
        updateTarget(targetId, { ...target, scenarioId });
      }
    });
    toast.success(`${selectedTargets.length} targets attached to scenario`);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {availableTargets.length === 0 ? (
          <p className="text-muted-foreground text-center p-4">
            No unattached targets available
          </p>
        ) : (
          availableTargets.map((target) => (
            <div
              key={target.id}
              onClick={() => handleTargetClick(target.id)}
              className={cn(
                "p-4 border rounded-lg cursor-pointer transition-colors",
                selectedTargets.includes(target.id)
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50"
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{target.name}</h3>
                  <p className="text-sm text-muted-foreground">{target.description}</p>
                </div>
                <Badge variant="outline">
                  {target.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                <span>Reduction: {target.targetPercentage}%</span>
                <span className="mx-2">•</span>
                <span>By {new Date(target.targetDate).toLocaleDateString()}</span>
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
          onClick={handleAttachTargets}
          disabled={selectedTargets.length === 0}
        >
          Add Selected ({selectedTargets.length})
        </Button>
      </div>
    </div>
  );
};
