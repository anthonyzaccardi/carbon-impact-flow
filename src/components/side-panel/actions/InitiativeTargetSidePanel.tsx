
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/useAppContext';
import { Target } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface InitiativeTargetSidePanelProps {
  data: { id: string };
  onClose: () => void;
}

export const InitiativeTargetSidePanel: React.FC<InitiativeTargetSidePanelProps> = ({
  data,
  onClose,
}) => {
  const { targets, tracks, initiatives, addTargetsToInitiative } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);

  const initiativeId = data.id;
  const initiative = initiatives.find(i => i.id === initiativeId);
  
  // Filter out targets already linked to this initiative
  const availableTargets = targets.filter(
    target => !initiative?.targetIds.includes(target.id)
  );

  // Apply search filter
  const filteredTargets = availableTargets.filter(
    target => target.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTargetSelection = (targetId: string) => {
    setSelectedTargets(prev => 
      prev.includes(targetId) 
        ? prev.filter(id => id !== targetId) 
        : [...prev, targetId]
    );
  };

  const handleAttachTargets = () => {
    if (selectedTargets.length > 0) {
      addTargetsToInitiative(initiativeId, selectedTargets);
      onClose();
    }
  };

  const getTrackName = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    return track ? `${track.emoji} ${track.name}` : 'Unknown Track';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Manage Targets</h2>
      <p className="text-sm text-muted-foreground">Select targets to attach to this initiative</p>
      
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search targets..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredTargets.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery ? "No targets match your search" : "No targets available to attach"}
        </div>
      ) : (
        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Track</TableHead>
                <TableHead>Target</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTargets.map((target) => (
                <TableRow 
                  key={target.id}
                  className={cn(
                    "cursor-pointer",
                    selectedTargets.includes(target.id) && "bg-primary/5"
                  )}
                  onClick={() => handleTargetSelection(target.id)}
                >
                  <TableCell className="p-2">
                    <Checkbox 
                      checked={selectedTargets.includes(target.id)}
                      onCheckedChange={() => handleTargetSelection(target.id)}
                      className="pointer-events-none" // Prevent event conflict with row click
                    />
                  </TableCell>
                  <TableCell>{target.name}</TableCell>
                  <TableCell>{getTrackName(target.trackId)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {target.targetPercentage}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div className="flex justify-end gap-2 pt-4 border-t">
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
