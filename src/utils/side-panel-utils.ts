
import { SidePanelState } from '@/contexts/AppContext';

export const getSidePanelTitle = (sidePanel: SidePanelState): string => {
  const { type, entityType } = sidePanel;
  const action = type === 'create' ? 'Create' : type === 'edit' ? 'Edit' : 'View';
  const entity = entityType.charAt(0).toUpperCase() + entityType.slice(1);
  
  return `${action} ${entity}`;
};
