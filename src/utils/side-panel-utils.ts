
import { SidePanel } from '@/types';

export const getSidePanelTitle = (sidePanel: SidePanel): string => {
  const { type, entityType } = sidePanel;
  const action = type === 'create' ? 'Create' : type === 'edit' ? 'Edit' : 'View';
  const entity = entityType.charAt(0).toUpperCase() + entityType.slice(1);
  
  return `${action} ${entity}`;
};
