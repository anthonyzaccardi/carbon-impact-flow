
import React from 'react';
import { InitiativeTargetSelector } from '@/components/initiatives/InitiativeTargetSelector';

interface InitiativeTargetSidePanelProps {
  data: { id: string };
  onClose: () => void;
}

export const InitiativeTargetSidePanel: React.FC<InitiativeTargetSidePanelProps> = ({
  data,
  onClose,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Manage Targets</h2>
      <p className="text-sm text-muted-foreground">Select targets to attach to this initiative</p>
      <InitiativeTargetSelector initiativeId={data.id} onClose={onClose} />
    </div>
  );
};
