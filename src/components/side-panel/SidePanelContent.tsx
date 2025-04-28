
import React from 'react';
import { SidePanel } from '@/types';
import { EntitySidePanel } from './actions/EntitySidePanel';
import { InitiativeTargetSidePanel } from './actions/InitiativeTargetSidePanel';

interface SidePanelContentProps {
  sidePanel: SidePanel;
  onClose: () => void;
}

const SidePanelContent: React.FC<SidePanelContentProps> = ({
  sidePanel,
  onClose,
}) => {
  const { type, entityType, data } = sidePanel;

  if (entityType === 'initiative-targets' && data) {
    return <InitiativeTargetSidePanel data={data} onClose={onClose} />;
  }

  return (
    <EntitySidePanel
      type={type}
      entityType={entityType}
      data={data}
      onClose={onClose}
    />
  );
};

export default SidePanelContent;
